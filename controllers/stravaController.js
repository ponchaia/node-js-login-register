const Users = require('../models/Users')
const StravaProfiles = require('../models/StravaProfiles')
const jwt = require('jsonwebtoken')

module.exports = async (req, res) => {
    const decodeToken = jwt.verify(req.cookies.nodeToken, process.env.JWT_SECRET_KEY);
    const refreshTokenUrl = `https://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&redirect_uri=${process.env.HOST}/exchangetoken&response_type=code&scope=activity:read_all`
    
    let UserData = await Users.findById(decodeToken.id).lean().exec()
    .catch((error) => {
        console.error(error);
    })
    let strava = await StravaProfiles.findOne({ userId: decodeToken.id }).lean().exec()
    .catch((error) => {
        console.error(error);
    })
    // let strava = await getData('https://www.strava.com/api/v3/athlete', UserData.accessToken)
    // console.log('UserData', UserData)
    // console.log('strava', strava)
    res.render('strava', {
        UserData,
        strava,
        refreshTokenUrl,
    })
}
async function getData(url = "", Authorization) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + Authorization,
      }
    });
    return response.json(); // parses JSON response into native JavaScript objects
}