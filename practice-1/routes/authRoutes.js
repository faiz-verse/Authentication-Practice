const { signupUser, signinUser } = require('../controllers/authController.js');

const authRoutes = (req, res) => {
    if (req.method === 'POST' && req.url === '/signup') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const formData = new URLSearchParams(body);
            req.body = {
                username: formData.get('username'),
                email: formData.get('email'),
                password: formData.get('password')
            };
            signupUser(req, res);
        });
        return;
    }

    if (req.method === 'POST' && req.url === '/signin') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const formData = new URLSearchParams(body);
            req.body = {
                username: formData.get('username'),
                password: formData.get('password')
            };
            signinUser(req, res);
        });
        return;
    }
};

module.exports = authRoutes;
