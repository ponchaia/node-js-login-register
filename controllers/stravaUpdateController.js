const Users = require('../models/Users')
const StravaProfiles = require('../models/StravaProfiles')

module.exports = async (req, res) => {
    let UserData = await Users.findById(req.session.userId)
    await getAthleteData(req.session.userId, UserData.accessToken)
    await getAthleteStatData(req.session.userId, UserData.accessToken, UserData.stravaUserId)
    await getAthleteActivityData(req.session.userId, UserData.accessToken)
    await getActivityData(req.session.userId, UserData.accessToken)
    let page = req.query.page ?? 'strava'
    return res.redirect(`/${page}`)
}

const getAthleteData = async (userId, accessToken) => {
    await getData('https://www.strava.com/api/v3/athlete', accessToken).then(async (data) => {
        if (!data.errors) {
            let profile = await StravaProfiles.findOne({ userId: userId }).lean().exec()
            console.log('profile', profile)
            if (profile) {
                let results = await StravaProfiles.updateOne({ _id: profile.id }, { athlete: data })
                console.log(results)
                console.log('Update athlete successfully!')
            } else {
                let results = await StravaProfiles.create({
                    userId: userId,
                    athlete: data,
                })
                console.log(results)
                console.log('New athlete successfully!')
            }
        } else {            
            console.log('Athlete', data)
        }
    }).catch((error) => {
        console.error(error)
    })
}
const getAthleteStatData = async (userId, accessToken, stravaUserId) => {
    await getData(`https://www.strava.com/api/v3/athletes/${stravaUserId}/stats`, accessToken).then(async (data) => {
        if (!data.errors) {
            let profile = await StravaProfiles.findOne({ userId: userId}).lean().exec()
            console.log('profile', profile)                
            if (profile) {
                let results = await StravaProfiles.updateOne({ _id: profile.id }, { athleteStat: data })
                console.log(results)
                console.log('Update athleteStat successfully!')
            } else {
                let results = await StravaProfiles.create({
                    userId: userId,
                    athleteStat: data,
                })
                console.log(results)
                console.log('Add athleteStat successfully!')
            }
        } else {
            console.log('Athlete Stat', data)
        }
    })
}
const getAthleteActivityData = async (userId, accessToken) => {
    await getData(`https://www.strava.com/api/v3/athlete/activities?before=1696689202&after=1665153202&page=1&per_page=30`, accessToken).then(async (data) => {
        if (!data.errors) {    
            let profile = await StravaProfiles.findOne({ userId: userId}).lean().exec()
            console.log('profile', profile)
            if (profile) {
                let results = await StravaProfiles.updateOne({ _id: profile.id }, { athleteActivities: data })
                    console.log(results)
                    console.log('Update User athlete activity successfully!')
            } else {
                let results = await StravaProfiles.create({
                    userId: userId,
                    athleteActivities: data,
                })
                console.log(results)
                console.log("Add User athlete activity successfully!")
            }
        } else {
            console.log('Athlete Activity', data)
        }
    })
}
const getActivityData = async (userId, accessToken) => {
    await getData(`https://www.strava.com/api/v3/activities/9317781659`, accessToken).then(async (data) => {
        if (!data.errors) {
            let profile = await StravaProfiles.findOne({ userId: userId}).lean().exec()
            console.log('profile', profile)                
            if (profile) {
                let results = await StravaProfiles.updateOne({ _id: profile.id }, { activities: data })
                console.log(results)
                console.log('Update User activities successfully!')
            } else {
                let results = await StravaProfiles.create({
                    userId: userId,
                    activities: data,
                })
                console.log(results)
                console.log("Add User activities successfully!")
            }           
        } else {
            console.log('Activity', data)
        }        
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