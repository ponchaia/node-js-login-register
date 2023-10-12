const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = async (req, res) => {
    let UserData = await prisma.users.findUnique({
        where: {
            id: req.session.userId,
        },
    })
    let strava = await prisma.stravaProfiles.findFirst({
        where: {
            userId: req.session.userId,
        },
    })

    console.log('strava', strava)
    res.render('strava', {
        UserData,
        strava,
    })
}
