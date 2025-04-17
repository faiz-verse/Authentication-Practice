const logoutSession = (req, res) => {
    res.writeHead(200, {
        'Set-Cookie': `sessionId=; HttpOnly; Path=/; Max-Age=0`,
        'Content-Type': 'application/json'
    });
    console.log('🍪 logout: received cookies →', req.headers.cookie);
    res.end(JSON.stringify({ success: true, message: 'Logged out!' }));
}

module.exports = logoutSession