const User = require('../models/Users')

module.exports = async (req, res) => {
    let UserData = await User.findById(req.session.userId)
    console.log(req)
    const code = req.query.code
    const reqBody = {
        client_id: process.env.STRAVA_CLIENT_ID.replace('\r',''),
        client_secret: process.env.STRAVA_CLIENT_SECRET.replace('\r',''),
        code,
        grant_underscore: 'authorization_code'
    }
    postData('https://www.strava.com/oauth/token', reqBody).then((data) => {
        console.log(data); // JSON data parsed by `data.json()` call
        const updateData = {
            stravaUserId: data.athlete.id,
            authorizationCode: code,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            tokenExpiresAt: data.expires_at,
            tokenExpiresIn: data.expires_in,
        }
        User.findOne({ email: UserData.email }).then((user) => {
            if (user) {
                console.log('User', user)
                User.updateOne({email: user.email}, updateData).then(() => {
                    console.log("Update strava user profile successfully!")
                    return res.redirect('/strava')
                }).catch((error) => {
                    console.log(error)
                    return res.redirect('/home')
                })
            }
        }).catch((error) => {
            console.log(error)
            return res.redirect('/')
        })
    }).catch((error) => {
        console.log(error)
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