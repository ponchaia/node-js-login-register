const Users = require('../models/Users')
const StravaProfiles = require('../models/StravaProfiles')
const jwt = require('jsonwebtoken')

module.exports = async (req, res) => {
    const decodeToken = jwt.verify(req.cookies.nodeToken, process.env.JWT_SECRET_KEY);
    let UserData = await Users.findById(decodeToken.id)
    await getAthleteData(decodeToken.id, UserData.accessToken)
    await getAthleteStatData(decodeToken.id, UserData.accessToken, UserData.stravaUserId)
    await getAthleteActivityData(decodeToken.id, UserData.accessToken)
    // await getActivityData(decodeToken.id, UserData.accessToken)
    let page = req.query.page ?? 'strava'
    return res.redirect(`/${page}`)
}

const getAthleteData = async (userId, accessToken) => {
    await getData('https://www.strava.com/api/v3/athlete', accessToken).then(async (data) => {
        if (!data.errors) {
            let profile = await StravaProfiles.findOne({ userId: userId }).lean().exec()
            console.log('profile', profile)
            if (profile) {
                let results = await StravaProfiles.updateOne({ _id: profile._id }, { athlete: data })
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
                let results = await StravaProfiles.updateOne({ _id: profile._id }, { athleteStat: data })
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
    let date = new Date();
    let before = Math.floor(date.getTime() / 1000);
    date.setDate(date.getDate() - 30);
    let after = Math.floor(date.getTime() / 1000);
    await getData(`https://www.strava.com/api/v3/athlete/activities?before=${before}&after=${after}&page=1&per_page=30`, accessToken).then(async (data) => {
        if (!data.errors) {    
            await StravaProfiles.findOne({ userId: userId}).lean().exec().then(async (profile) => {
                console.log('profile', profile)
                if (profile) {
                    let results = await StravaProfiles.updateOne({ _id: profile._id }, { athleteActivities: data })
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
            }).then(async() => {
                await StravaProfiles.findOne({ userId: userId}).lean().exec().then(profile => {
                    profile.athleteActivities.forEach(async element => {
                        getActivityData(userId, accessToken, element.id)
                    });
                })
                
            })
            
        } else {
            console.log('Athlete Activity', data)
        }
    })
}
const getActivityData = async (userId, accessToken, activityId) => {
    await getData(`https://www.strava.com/api/v3/activities/${activityId}`, accessToken).then(async (activities) => {
        if (!activities.errors) {
            let profile = await StravaProfiles.findOne({ userId: userId}).lean().exec()
            console.log('profile', profile)                
            if (profile) {
                let results = await StravaProfiles.findOneAndUpdate({ 'athleteActivities.id': activityId }, { $set: { 'athleteActivities.$.activities': activities } })
                .catch(error => console.error(error))
                console.log(results)
                console.log('Update User activities successfully!')
            }        
        } else {
            console.log('Activity', activities)
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