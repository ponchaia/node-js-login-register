const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = async (req, res) => {
    const { email, password } = req.body
    await prisma.users.findUnique({
        where: {
            email: email,
        },
    }).then(async (user) => {
        if (user) {
            console.log(user)
            console.log("This email already in use!")
            req.flash('validationErrors', ["This email already in use!"])
            req.flash('data', req.body)
            return res.redirect('/register')
        } else {
            await prisma.users.create({
                data: req.body,
            }).then(async() => {
                await prisma.$disconnect()
                console.log("User registered successfully!")
                res.redirect('/')
            }).catch(async(error) => {
                // console.log(error)
                console.error(e)
                await prisma.$disconnect()
                if (error) {
                    const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
                    req.flash('validationErrors', validationErrors)
                    req.flash('data', req.body)
                    return res.redirect('/register')
                }
            })
            // User.create(req.body).then(() => {
            //     console.log("User registered successfully!")
            //     res.redirect('/')
            // }).catch((error) => {
            //     // console.log(error)
            //     if (error) {
            //         const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
            //         req.flash('validationErrors', validationErrors)
            //         req.flash('data', req.body)
            //         return res.redirect('/register')
            //     }
            // })
        }
    })
    // User.findOne({ email: email }).then((user) => {
    //     if (user) {
    //         console.log(user)
    //         console.log("This email already in use!")
    //         req.flash('validationErrors', ["This email already in use!"])
    //         req.flash('data', req.body)
    //         return res.redirect('/register')
    //     } else {
    //         User.create(req.body).then(() => {
    //             console.log("User registered successfully!")
    //             res.redirect('/')
    //         }).catch((error) => {
    //             // console.log(error)
    //             if (error) {
    //                 const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
    //                 req.flash('validationErrors', validationErrors)
    //                 req.flash('data', req.body)
    //                 return res.redirect('/register')
    //             }
    //         })
    //     }
    // })
}