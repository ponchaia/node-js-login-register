const Users = require('../models/Users')

module.exports = async (req, res) => {
    const { email, password } = req.body
    let user = await Users.findOne({ email: email }).lean().exec()
    if (user) {
        console.log('user', user)
        console.log("This email already in use!")
        req.flash('validationErrors', ["This email already in use!"])
        req.flash('data', req.body)
        return res.redirect('/register')
    } else {
        await Users.create(req.body).then(() => {
            console.log("User registered successfully!")
            res.redirect('/')
        }).catch((error) => {
            console.error(error)
            if (error) {
                const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
                req.flash('validationErrors', validationErrors)
                req.flash('data', req.body)
                return res.redirect('/register')
            }
        })
    }
}