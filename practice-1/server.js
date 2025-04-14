const http = require('http')
const router = require('./routes/router.js')

const PORT = process.env.PORT || 3000

const server = http.createServer((req, res) => {
    router(req,res)
})

server.listen(PORT, () => {
    console.log('Server running on PORT:', PORT)
})