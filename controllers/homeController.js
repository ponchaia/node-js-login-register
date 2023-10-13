const Users = require('../models/Users')

module.exports = async (req, res) => {
    const refreshTokenUrl = `https://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&redirect_uri=${process.env.HOST}/exchangetoken&response_type=code&scope=activity:read_all`
    let date = new Date();
    let unixTimeStamp = Math.floor(date.getTime() / 1000);
    let UserData = await Users.findById(req.session.userId)
    console.log('UserData', UserData)
    let clientId = process.env.STRAVA_CLIENT_ID
    let clientSecret = process.env.STRAVA_CLIENT_SECRET
    console.log('clientId', clientId)
    console.log('clientSecret', clientSecret)
    if (UserData) {
        if (UserData.stravaUserId && UserData.stravaUserId != 0 && UserData.tokenExpiresAt < unixTimeStamp) {            
            console.log('Strava token expired')
            postData(`https://www.strava.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&code=${UserData.authorizationCode}&grant_type=refresh_token&refresh_token=${UserData.refreshToken}`)
            .then(async (response) => {
                if (response) {
                    let data = {
                        accessToken: response.access_token,
                        refreshToken: response.refresh_token,
                        tokenExpiresAt: response.expires_at,
                        tokenExpiresIn: response.expires_in
                    }
                    let results = await Users.updateOne({ _id: UserData.id }, data )
                    console.log(results)
                    if(res.upsertedCount > 0) console.log('Updated UserData')
                }
            }).catch(async (e) => {
                console.error(e)
            })
        }
    }
    
    res.render('home', {
        UserData,
        refreshTokenUrl
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

const getData = async (url = "") => {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json(); // parses JSON response into native JavaScript objects
}