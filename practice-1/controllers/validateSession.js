const fs = require('fs')
const path = require('path')

const validateSession = (req, res) => {
    const cookies = req.headers.cookie;
    const sessionId = cookies?.split('; ').find(c => c.startsWith('sessionId='))?.split('=')[1];

    if (!sessionId) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'No session found' }));
        return;
    }

    const jsonFilePath = path.join(__dirname, '..', 'userData.json');
    fs.readFile(jsonFilePath, 'utf-8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Error reading user data' }));
            return;
        }

        const users = JSON.parse(data);
        const user = users.find(u => u.sessionId === sessionId);

        if (user && Date.now() < user.sessionExpiresAt) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, user: { username: user.username, email: user.email } }));
        } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Session expired or invalid' }));
        }
    });
};

module.exports = validateSession