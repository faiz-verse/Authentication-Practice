const signupUser = (req, res) => {
    const { username, email, password } = req.body;
    // Validate, hash password, save to DB, etc.
    // res.send("User signed up!");
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        success: true,
        message: '✅ User signed up!',
        redirectTo: '/dashboard'
    }));
};

const signinUser = (req, res) => {
    const { username, password } = req.body;
    // Check credentials, create session/cookie
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        success: true,
        message: '✅ User signed in!',
        redirectTo: '/dashboard'
    }));
};

module.exports = { signupUser, signinUser };
