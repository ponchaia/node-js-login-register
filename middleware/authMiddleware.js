const Users = require('../models/Users')

module.exports = async (req, res, next) => {
    console.log('Auth middleware session ID', req.session.userId)
    let user = await Users.findById(req.session.userId).exec().catch((e) => {
        console.error(e)
        return res.redirect('/')
    })
    if (!user) {
        return res.redirect('/')
    }
    console.log('User logged in successfully')
    next()
}