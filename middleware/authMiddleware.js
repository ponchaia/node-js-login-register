const Users = require('../models/Users')

module.exports = async (req, res, next) => {
    console.log('Auth middleware session ID', req.session.userId)
    await Users.findById(req.session.userId)
    .then((user) => {
        if (!user) {
            return res.redirect('/')
        }
        console.log('User logged in successfully')
        next()
    }).catch((e) => {
        console.error(e)
        return res.redirect('/')
    })
}