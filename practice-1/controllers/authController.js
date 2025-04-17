const fs = require('fs');
const path = require('path');

const signupUser = (req, res) => {
    const { username, email, password } = req.body;
    
    const newUser = {
        username,
        email,
        password, // ideally hashed later
        signedUpAt: Date.now()
    };

    const jsonFilePath = path.join(__dirname, '..', 'userData.json');

    fs.readFile(jsonFilePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Error signing up user' }));
            return;
        }

        let users = [];
        if (data) {
            users = JSON.parse(data);
        }

        users.push(newUser);

        fs.writeFile(jsonFilePath, JSON.stringify(users, null, 2), 'utf-8', (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Error saving user data' }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
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
            console.error('Error reading file:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Internal server error' }));
            return;
        }

        let users = [];
        if (data) {
            users = JSON.parse(data);
        }

        const foundUser = users.find(
            user => (user.username === username || user.email === username) && user.password === password
        );

        if (foundUser) {
            // ✅ Credentials matched
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                message: '✅ User signed in!',
                user: { username: foundUser.username, email: foundUser.email },
                redirectTo: '/dashboard'
            }));
        } else {
            // ❌ Invalid credentials
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                message: '❌ Invalid username or password'
            }));
        }
    });
};

module.exports = { signupUser, signinUser };
