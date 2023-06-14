// Router Specific Middleware
// import jsonwebtoken
const jwt = require('jsonwebtoken')

// define logic for checking user login or not
const logMiddleware = (req, res, next) => {
    console.log("Router Specific Middleware");
    // get token
    const token = req.headers['access-token']
    console.log(token);
    // verify the token
    try {
        const {loginAcno} = jwt.verify(token, "supersecretkey12345")
        console.log(loginAcno);
        // pass loginAcno to req
        req.debitAcno = loginAcno
        // to process user request
        next()
    }
    catch {
        res.status(401).json("Please Login")
    }
}

module.exports = {
    logMiddleware
}