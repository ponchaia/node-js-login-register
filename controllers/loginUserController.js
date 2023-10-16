const bcrypt = require('bcrypt')
const Users = require('../models/Users')
const jwt = require('jsonwebtoken')

module.exports = async (req, res) => {
    const { email, password } = req.body
    let user = await Users.findOne({ email: email }).lean().exec()
    if (user) {
        console.log('user', user)
        let cmp = bcrypt.compare(password, user.password).then(async (match) => {
            if (match) {
                console.log("User's password is match")
                const tokenData = {
                    id: user._id,
                    email: user.email
                }
                console.log(process.env.JWT_SECRET_KEY)
                const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {expiresIn: "1d"})
                res.cookie('nodeToken', token)
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