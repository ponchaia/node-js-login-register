const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = async (req, res) => {
    console.log('Strava connect req', req)
    let UserData = await prisma.users.findUnique({
        where: {
            id: req.session.userId,
        },
    })
    const code = req.query.code
    const reqBody = {
        client_id: process.env.STRAVA_CLIENT_ID.replace('\r',''),
        client_secret: process.env.STRAVA_CLIENT_SECRET.replace('\r',''),
        code,
        grant_underscore: 'authorization_code'
    }
    postData('https://www.strava.com/oauth/token', reqBody).then(async (data) => {
        console.log(data); // JSON data parsed by `data.json()` call
        const updateData = {
            stravaUserId: data.athlete.id,
            authorizationCode: code,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            tokenExpiresAt: data.expires_at,
            tokenExpiresIn: data.expires_in,
        }
        await prisma.users.findUnique({
            where: {
                id: req.session.userId,
            },
        }).then(async (user) => {
            if (user) {
                console.log('User', user)
                await prisma.users.update({
                    where: {
                        id: user.id,
                    },
                    data: updateData
                }).then(async () => {                    
                    await prisma.$disconnect()
                    console.log("Update strava user profile successfully!")
                    return res.redirect('/strava')
                }).catch(async (error) => {
                    await prisma.$disconnect()
                    console.error(error)
                    return res.redirect('/home')
                })
            }
        }).catch(async (error) => {
            await prisma.$disconnect()
            console.error(error)
            return res.redirect('/')
        })
    }).catch((error) => {
        console.error(error)
        return res.redirect('/')
    })
}

async function postData(url = "", data = {}) {
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