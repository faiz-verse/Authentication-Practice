const fs = require('fs');
const path = require('path');

const generateSessionId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const signupUser = (req, res) => {
    const { username, email, password } = req.body;

    const sessionId = generateSessionId();
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    const newUser = {
        username,
        email,
        password, // hash later ideally
        signedUpAt: Date.now(),
        sessionId,
        sessionExpiresAt: expiresAt,
        preferences: {
            theme: "default",
            font: "Arial, Helvetica, sans-serif"
        }
    };

    const jsonFilePath = path.join(__dirname, '..', 'userData.json');

    fs.readFile(jsonFilePath, 'utf-8', (err, data) => {
        let users = [];
        if (!err && data) {
            users = JSON.parse(data);
        }

        users.push(newUser);

        fs.writeFile(jsonFilePath, JSON.stringify(users, null, 2), 'utf-8', (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Error saving user data' }));
                return;
            }

            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Set-Cookie': `sessionId=${sessionId}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}`
            });
            res.end(JSON.stringify({
                success: true,
                message: '✅ User signed up!',
                newUser,
                redirectTo: '/dashboard'
            }));
        });
    });
};

const signinUser = (req, res) => {
    const { username, password } = req.body;
    const jsonFilePath = path.join(__dirname, '..', 'userData.json');

    fs.readFile(jsonFilePath, 'utf-8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Internal server error' }));
            return;
        }

        let users = data ? JSON.parse(data) : [];
        const index = users.findIndex(
            user => (user.username === username || user.email === username) && user.password === password
        );

        if (index !== -1) {
            // ✅ Valid login
            const sessionId = generateSessionId();
            const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

            users[index].sessionId = sessionId;
            users[index].sessionExpiresAt = expiresAt;

            fs.writeFile(jsonFilePath, JSON.stringify(users, null, 2), 'utf-8', (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Error updating session' }));
                    return;
                }

                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Set-Cookie': `sessionId=${sessionId}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}`
                });
                res.end(JSON.stringify({
                    success: true,
                    message: '✅ User signed in!',
                    redirectTo: '/dashboard'
                }));
            });
        } else {
            // ❌ Invalid login
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: '❌ Invalid credentials' }));
        }
    });
};


const querystring = require("querystring");
const updatePreferences = (req, res) => {
    let body = "";
    req.on("data", chunk => {
        body += chunk;
    });

    req.on("end", () => {
        try {
            // ✅ Properly parse JSON body
            const parsedBody = JSON.parse(body);
            const theme = parsedBody.theme;
            const font = parsedBody.font;
            console.log("Parsed body: ", parsedBody);

            // ✅ Extract sessionId from cookies
            const cookies = req.headers.cookie || "";
            const sessionId = cookies
                .split(";")
                .map(cookie => cookie.trim())
                .find(c => c.startsWith("sessionId="))
                ?.split("=")[1];

            if (!sessionId) {
                console.log("No sessionId found in cookies");
                res.writeHead(401, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "No session ID found" }));
                return;
            }

            console.log("Session ID:", sessionId);

            // ✅ Read userData.json
            const jsonFilePath = path.join(__dirname, '..', 'userData.json');
            const fileData = fs.readFileSync(jsonFilePath, "utf-8");
            const users = JSON.parse(fileData);

            // ✅ Find the user
            const user = users.find(u => u.sessionId === sessionId);
            if (!user) {
                console.log("No user found with sessionId:", sessionId);
                res.writeHead(401, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Invalid session" }));
                return;
            }

            // ✅ Update preferences
            user.preferences = { theme, font };
            fs.writeFileSync(jsonFilePath, JSON.stringify(users, null, 2));

            console.log("Preferences updated for user:", user.username);

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true, message: "Preferences updated" }));
        } catch (err) {
            console.error("Error in updatePreferences:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Server error" }));
        }
    });
};




module.exports = { signupUser, signinUser, updatePreferences };
