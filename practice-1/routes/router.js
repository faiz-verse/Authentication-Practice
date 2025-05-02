const fs = require('fs')
const path = require('path')
const mime = require('mime-types') // optional but recommended

const pageController = require('../controllers/pageController.js')

const authRoutes = require('./authRoutes'); // 👈 import auth routes
const validateSession = require('../controllers/validateSession.js');
const logoutSession = require('../controllers/logoutSession.js')

const router = (req, res) => {

    // ✅ Serve static files from /public
    if (req.url.startsWith('/public/')) {
        const filePath = path.join(__dirname, '..', req.url)
        const contentType = mime.lookup(filePath) || 'application/octet-stream'

        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' })
                res.end('File Not Found 😞')
            } else {
                res.writeHead(200, { 'Content-Type': contentType })
                res.end(content)
            }
        })
        return
    }

    // ✅ For pages
    if (req.url == '/') {
        pageController.home(req, res)
    }
    else if (req.url == '/dashboard') {
        pageController.dashboard(req, res)
    }
    // ✅ Forward auth routes here
    else if (req.url === '/signup' || req.url === '/signin') {
        return authRoutes(req, res) // 👈 manually forward
    }
    // ✅ validate session
    else if (req.url === '/validate-session') {
        return validateSession(req, res)
    }
    // ✅ logout session (delete session cookie)
    else if (req.url === '/logout') {
        console.log('📡 Incoming request URL:', req.method, req.url);
        return logoutSession(req, res)
    }
    else if (req.url === "/customize" && req.method === "POST") {
        const { updatePreferences } = require("../controllers/authController");
        updatePreferences(req, res);
    }  
    else if (req.url === "/getPreferences" && req.method === "GET") {
        const { getPreferences } = require("../controllers/authController");
        getPreferences(req, res);
    }     
    else {
        pageController.notFound(req, res)
    }
}

module.exports = router