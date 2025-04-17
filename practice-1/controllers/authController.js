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
        sessionExpiresAt: expiresAt
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

module.exports = { signupUser, signinUser };
