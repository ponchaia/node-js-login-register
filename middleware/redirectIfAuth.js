const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    if (req.cookies.nodeToken) {
        const decodeToken = jwt.verify(req.cookies.nodeToken, process.env.JWT_SECRET_KEY);
        if (decodeToken.id) {
            return res.redirect('/')
        }
    }    
    next()
}