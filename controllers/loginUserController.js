const bcrypt = require('bcrypt')
const Users = require('../models/Users')

module.exports = async (req, res) => {
    const { email, password } = req.body
    let user = await Users.findOne({ email: email }).lean().exec()
    .catch((e) => {
        console.error(e)     
        res.redirect('/login')
    })
    if (user) {
        console.log('user', user)
        let cmp = bcrypt.compare(password, user.password).then((match) => {
            if (match) {
                console.log("User's password is match")
                req.session.userId = user.id
                res.redirect('/home')
            } else {
                console.log("User's password is not match")
                res.redirect('/login')
            }
        }).catch((e) => {
            console.error(e)
            res.redirect('/login')
        })
    } else {        
        console.log("User not found!")
        res.redirect('/login')
    }
}