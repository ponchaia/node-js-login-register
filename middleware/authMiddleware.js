const Users = require('../models/Users')
const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    console.log('Auth middleware cookie token', req.cookies.nodeToken)
    const decodeToken = req.cookies.nodeToken ? jwt.verify(req.cookies.nodeToken, process.env.JWT_SECRET_KEY) : '';
    console.log('decodeToken', decodeToken)
    let user = await Users.findById(decodeToken.id).exec().catch((e) => {
        console.error(e)
        return res.redirect('/')
    })
    if (!user) {
        return res.redirect('/login')
    }
    console.log('User logged in successfully')
    next()
}