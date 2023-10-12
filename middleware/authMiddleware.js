const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = async (req, res, next) => {
    await prisma.users.findUnique({
        where: {
            id: req.session.userId,
        },
    }).then((user) => {
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