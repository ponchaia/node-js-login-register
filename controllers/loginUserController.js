const bcrypt = require('bcrypt')
const Users = require('../models/Users')

module.exports = async (req, res) => {
    const { email, password } = req.body
    
    await Users.findOne({ email: email }).then(async (user) =>{
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
            }).catch(async (e) => {
                console.error(e)
                res.redirect('/login')
            })
        } else {        
            console.log("User not found!")
            res.redirect('/login')
        }
    }).catch(async (e) => {
        console.error(e)     
        res.redirect('/login')
    })
}