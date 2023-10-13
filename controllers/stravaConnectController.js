const Users = require('../models/Users')

module.exports = async (req, res) => {
    const code = req.query.code
    const reqBody = {
        client_id: process.env.STRAVA_CLIENT_ID.replace('\r',''),
        client_secret: process.env.STRAVA_CLIENT_SECRET.replace('\r',''),
        code,
        grant_underscore: 'authorization_code'
    }
    await postData('https://www.strava.com/oauth/token', reqBody).then(async (data) => {
        console.log(data); // JSON data parsed by `data.json()` call
        const updateData = {
            stravaUserId: data.athlete.id,
            authorizationCode: code,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            tokenExpiresAt: data.expires_at,
            tokenExpiresIn: data.expires_in,
        }
        let results = await Users.findOneAndUpdate({ _id: req.session.userId}, updateData).catch((error) => {
            console.error(error)
            return res.redirect('/home')
        })
        console.log(results)
        console.log("Update strava user profile successfully!")
        return res.redirect('/strava')
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