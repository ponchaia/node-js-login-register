const Users = require('../models/Users')
const StravaProfiles = require('../models/StravaProfiles')

module.exports = async (req, res) => {
    const refreshTokenUrl = `https://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&redirect_uri=${process.env.HOST}/exchangetoken&response_type=code&scope=activity:read_all`
    
    console.log('strava req user id', req.session.userId)
    let strava = await StravaProfiles.findOne({ userId: req.session.userId })
    .then((data) => {        
        console.log('strava', data)
        return data
    })
    .catch(async (error) => {
        console.error(error);
    })
    res.render('strava', {
        strava,
        refreshTokenUrl,
    })
}
