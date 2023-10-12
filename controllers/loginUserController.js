const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
module.exports = async (req, res) => {
    const { email, password } = req.body
    
    await prisma.users.findFirst({
        where: {
            email: email,
        },
    }).then(async (user) =>{
        if (user) {
            console.log('user', user)
            let cmp = bcrypt.compare(password, user.password).then(async (match) => {
                if (match) {
                    console.log("User's password is match")
                    req.session.userId = user.id
                    res.redirect('/home')
                } else {
                    console.log("User's password is not match")
                    res.redirect('/login')
                }
            }).then(async () => {
                await prisma.$disconnect()
            }).catch(async (e) => {
                console.error(e)
                await prisma.$disconnect()
                process.exit(1)
            })
        } else {        
            console.log("User not found!")
            res.redirect('/login')
        }
    }).catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()        
        res.redirect('/login')
    })
}