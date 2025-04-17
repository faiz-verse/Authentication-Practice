const fs = require('fs')
const path = require('path')
const mime = require('mime-types') // optional but recommended

const pageController = require('../controllers/pageController.js')

const authRoutes = require('./authRoutes'); // 👈 import auth routes

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
        return authRoutes(req, res); // 👈 manually forward
    }
    else {
        pageController.notFound(req, res)
    }
}

module.exports = router