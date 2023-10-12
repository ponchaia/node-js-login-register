const Users = require('../models/Users')
const StravaProfiles = require('../models/StravaProfiles')

module.exports = async (req, res) => {
    let UserData = await Users.findById(req.session.userId)
    getAthleteData(req.session.userId, UserData.accessToken)
    getAthleteStatData(req.session.userId, UserData.accessToken, UserData.stravaUserId)
    getAthleteActivityData(req.session.userId, UserData.accessToken)
    getActivityData(req.session.userId, UserData.accessToken)
    return res.redirect('/strava')
}

const getAthleteData = async (userId, accessToken) => {
    await getData('https://www.strava.com/api/v3/athlete', accessToken).then( async (data) => {
        if (!data.errors) {
            await StravaProfiles.findOne({ userId: userId}).then(async (profile) => {
                console.log('profile', profile)                
                if (profile) {
                    await StravaProfiles.updateOne({ id: profile.id }, { athlete: data })
                    .then(() => {
                        console.log('Update athlete successfully!')
                    }).catch((error) => {
                        console.error(error)
                    }) 
                } else {
                    await StravaProfiles.create({
                        userId: userId,
                        athlete: data,
                    }).then(() => {
                        console.log('New athlete successfully!')
                    }).catch((error) => {
                        console.error(error)
                    }) 
                }
            }).catch((error) => {
                console.error(error)
            })
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
            await StravaProfiles.findOne({ userId: userId}).then(async (profile) => {
                console.log('profile', profile)                
                if (profile) {
                    await StravaProfiles.updateOne({ id: profile.id }, { athleteStat: data })
                    .then(() => {
                        console.log('Update athleteStat successfully!')
                    }).catch((error) => {
                        console.error(error)
                    }) 
                } else {
                    await StravaProfiles.create({
                        userId: userId,
                        athleteStat: data,
                    }).then(() => {
                        console.log('Add athleteStat successfully!')
                    }).catch((error) => {
                        console.error(error)
                    }) 
                }
            }).catch((error) => {
                console.error(error)
            })
        } else {
            console.log('Athlete Stat', data)
        }
    })
}
const getAthleteActivityData = async (userId, accessToken) => {
    await getData(`https://www.strava.com/api/v3/athlete/activities?before=1696689202&after=1665153202&page=1&per_page=30`, accessToken).then(async (data) => {
        if (!data.errors) {    
            await StravaProfiles.findOne({ userId: userId}).then(async (profile) => {
                console.log('profile', profile)                
                if (profile) {
                    await StravaProfiles.updateOne({ id: profile.id }, { athleteActivities: data })
                    .then(() => {
                        console.log('Update User athlete activity successfully!')
                    }).catch((error) => {
                        console.error(error)
                    })
                } else {
                    await StravaProfiles.create({
                        userId: userId,
                        athleteActivities: data,
                    }).then(() => {
                        console.log("Add User athlete activity successfully!")
                    }).catch((error) => {
                        console.error(error)
                    }) 
                }
            }).catch((error) => {
                console.error(error)
            })            
        } else {
            console.log('Athlete Activity', data)
        }
    })
}
const getActivityData = async (userId, accessToken) => {
    await getData(`https://www.strava.com/api/v3/activities/9317781659`, accessToken).then((data) => {
        if (!data.errors) {
            StravaProfiles.findOne({ userId: userId}).then(async (profile) => {
                console.log('profile', profile)                
                if (profile) {
                    await StravaProfiles.updateOne({ id: profile.id }, { activities: data })
                    .then(() => {
                        console.log('Update User activities successfully!')
                    }).catch((error) => {
                        console.error(error)
                    }) 
                } else {
                    await StravaProfiles.create({
                        userId: userId,
                        activities: data,
                    }).then(() => {
                        console.log("Add User activities successfully!")
                    }).catch((error) => {
                        console.error(error)
                    }) 
                }
            }).catch((error) => {
                console.error(error)
            })            
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