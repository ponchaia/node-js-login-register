const Users = require('../models/Users')
const StravaProfiles = require('../models/StravaProfiles')

module.exports = async (req, res) => {
    const refreshTokenUrl = `https://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&redirect_uri=${process.env.HOST}/exchangetoken&response_type=code&scope=activity:read_all`
    
    console.log('strava req user id', req.session.userId)
    let UserData = await Users.findById(req.session.userId).lean().exec()
    .catch((error) => {
        console.error(error);
    })
    let strava = await StravaProfiles.find({ userId: req.session.userId }).lean().exec()
    .catch((error) => {
        console.error(error);
    })
    console.log('UserData', UserData)
    console.log('strava', strava)
    res.render('strava', {
        UserData,
        strava,
        refreshTokenUrl,
    })
}
