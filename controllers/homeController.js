const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = async (req, res) => {
    let date = new Date();
    let unixTimeStamp = Math.floor(date.getTime() / 1000);
    // let UserData = await Users.findById(req.session.userId)
    let UserData = await prisma.users.findUnique({
        where: {
            id: req.session.userId,
        },
    })
    console.log('UserData', UserData)
    let clientId = process.env.STRAVA_CLIENT_ID
    let clientSecret = process.env.STRAVA_CLIENT_SECRET
    console.log('clientId', clientId)
    console.log('clientSecret', clientSecret)
    if (UserData) {
        if (UserData.stravaUserId && UserData.stravaUserId != 0 && UserData.tokenExpiresAt < unixTimeStamp) {
            postData(`https://www.strava.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&code=${UserData.authorizationCode}&grant_type=refresh_token&refresh_token=${UserData.refreshToken}`)
            .then(async (response) => {
                if (response) {
                    let data = {
                        accessToken: response.access_token,
                        refreshToken: response.refresh_token,
                        tokenExpiresAt: response.expires_at,
                        tokenExpiresIn: response.expires_in
                    }
                    await prisma.users.update({
                        where: {
                            id: UserData.id,
                        },
                        data: data
                    }).then(async (updateUserData) => {
                        console.log('updateUserData', updateUserData)
                        await prisma.$disconnect()
                    })
                    // Users.updateOne({ email: UserData.email}, data).then(() => {
                    //     console.log("Update strava token successfully!")
                    // }).catch((error) => {
                    //     console.log(error)
                    // })
                }
            }).then(async () => {
                await prisma.$disconnect()
            }).catch(async (e) => {
                console.error(e)
                await prisma.$disconnect()
                process.exit(1)
            })
        }
    }
    
    res.render('home', {
        UserData
    })
}

const postData = async (url = "", data = {}) => {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json(); // parses JSON response into native JavaScript objects
}