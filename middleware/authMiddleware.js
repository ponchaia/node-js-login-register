const Users = require('../models/Users')
const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    let date = new Date();
    let unixTimeStamp = Math.floor(date.getTime() / 1000);
    console.log('Auth middleware cookie token', req.cookies.nodeToken)
    if (req.cookies.nodeToken) {
        const decodeToken = req.cookies.nodeToken ? jwt.verify(req.cookies.nodeToken, process.env.JWT_SECRET_KEY) : '';
        console.log('decodeToken', decodeToken)
        if (decodeToken && decodeToken.exp > unixTimeStamp) {
            let user = await Users.findById(decodeToken.id).exec().catch((e) => {
                console.error(e)
                return res.redirect('/')
            })
            if (!user) {
                res.clearCookie('nodeToken')
                return res.redirect('/login')
            }            
            console.log('User logged in successfully')
        } else {   
            res.clearCookie('nodeToken')         
            return res.redirect('/login')
        }
    } else {
        return res.redirect('/login')
    }
    
    next()
}