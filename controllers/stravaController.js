const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = async (req, res) => {
    // let UserData = await User.findById(req.session.userId)
    let UserData = await prisma.users.findUnique({
        where: {
            id: req.session.userId,
        },
    })
    // let strava = await StravaProfile.findOne({ userId: req.session.userId })
    let strava = await prisma.stravaProfiles.findFirst({
        where: {
            userId: req.session.userId,
        },
    })

    console.log(strava)
    res.render('strava', {
        UserData,
        strava,
    })
}
