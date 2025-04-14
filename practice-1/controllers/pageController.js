const path = require('path')
const fs = require('fs')

const home = (req,res) => {
    const homeHtml = fs.readFileSync(path.join(__dirname, "../views/home.html"))
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(homeHtml)
}

const dashboard = (req,res) => {
    const dashboardHtml = fs.readFileSync(path.join(__dirname, "../views/dashboard.html"))
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(dashboardHtml)
}

const notFound = (req,res) => {
    const notFoundHtml = fs.readFileSync(path.join(__dirname, "../views/404.html"))
    res.writeHead(404, {'Content-Type': 'text/html'})
    res.end(notFoundHtml)
}

module.exports = {
    home,
    dashboard,
    notFound
}