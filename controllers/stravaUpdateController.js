const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = async (req, res) => {
    let UserData = await prisma.users.findUnique({
        where: {
            id: req.session.userId,
        },
    })
    getAthleteData(req.session.userId, UserData.accessToken).then(async () => {
        await prisma.$disconnect()
    }).catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
    getAthleteStatData(req.session.userId, UserData.accessToken, UserData.stravaUserId).then(async () => {
        await prisma.$disconnect()
    }).catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
    getAthleteActivityData(req.session.userId, UserData.accessToken).then(async () => {
        await prisma.$disconnect()
    }).catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
    getActivityData(req.session.userId, UserData.accessToken).then(async () => {
        await prisma.$disconnect()
    }).catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
    return res.redirect('/strava')
}

const getAthleteData = async (userId, accessToken) => {
    await getData('https://www.strava.com/api/v3/athlete', accessToken).then( async (data) => {
        if (!data.errors) {
            await prisma.stravaProfiles.findFirst({
                where: {
                    userId: userId,
                },
            }).then(async (profile) => {
                console.log('profile', profile)                
                if (profile) {
                    await prisma.stravaProfiles.update({
                        where: {
                            id: profile.id,
                        },
                        data: {
                            athlete: data,
                        },
                    }).then(async (updateProfile) => {
                        console.log('updateProfile', updateProfile)
                        await prisma.$disconnect()
                    })
                } else {
                    await prisma.stravaProfiles.create({
                        data: {
                            userId: userId,
                            athlete: data,
                        },
                    }).then(async (newStravaProfile) => {
                        console.log('newStravaProfile', newStravaProfile)
                        await prisma.$disconnect()
                    })
                }
            })        
        } else {            
            console.log('Athlete', data)
        }
    }).catch((error) => {
        console.log(error)
    })
}
const getAthleteStatData = async (userId, accessToken, stravaUserId) => {
    await getData(`https://www.strava.com/api/v3/athletes/${stravaUserId}/stats`, accessToken).then(async (data) => {
        if (!data.errors) {
            await prisma.stravaProfiles.findFirst({
                where: {
                    userId: userId,
                },
            }).then(async (profile) => {
                console.log('profile', profile)                
                if (profile) {
                    await prisma.stravaProfiles.update({
                        where: {
                            id: profile.id,
                        },
                        data: {
                            athleteStat: data,
                        },
                    }).then(async () => {
                        console.log("Update User athlete stat successfully!")
                        await prisma.$disconnect()
                    })
                } else {
                    await prisma.stravaProfiles.create({
                        data: {
                            userId: userId,
                            athleteStat: data,
                        },
                    }).then(async () => {
                        console.log("Add User athlete stat successfully!")
                        await prisma.$disconnect()
                    })
                }
            }).catch(async(error) => {
                await prisma.$disconnect()
                console.log(error)
            })
        } else {
            console.log('Athlete Stat', data)
        }
    })
}
const getAthleteActivityData = async (userId, accessToken) => {
    await getData(`https://www.strava.com/api/v3/athlete/activities?before=1696689202&after=1665153202&page=1&per_page=30`, accessToken).then(async (data) => {
        if (!data.errors) {            
            await prisma.stravaProfiles.findFirst({
                where: {
                    userId: userId,
                },
            }).then(async (profile) => {
                console.log('profile', profile)                
                if (profile) {
                    await prisma.stravaProfiles.update({
                        where: {
                            id: profile.id,
                        },
                        data: {
                            athleteActivities: data,
                        },
                    }).then(async () => {
                        console.log("Update User athlete stat successfully!")
                        await prisma.$disconnect()
                    })
                } else {
                    await prisma.stravaProfiles.create({
                        data: {
                            userId: userId,
                            athleteActivities: data,
                        },
                    }).then(async () => {
                        console.log("Add User athlete stat successfully!")
                        await prisma.$disconnect()
                    })
                }
            }).catch(async(error) => {
                await prisma.$disconnect()
                console.log(error)
            })
        } else {
            console.log('Athlete Activity', data)
        }
    })
}
const getActivityData = async (userId, accessToken) => {
    await getData(`https://www.strava.com/api/v3/activities/9317781659`, accessToken).then(async (data) => {
        if (!data.errors) {
            await prisma.stravaProfiles.findFirst({
                where: {
                    userId: userId,
                },
            }).then(async (profile) => {
                console.log('profile', profile)                
                if (profile) {
                    await prisma.stravaProfiles.update({
                        where: {
                            id: profile.id,
                        },
                        data: {
                            activities: data,
                        },
                    }).then(async () => {
                        console.log("Update User athlete stat successfully!")
                        await prisma.$disconnect()
                    })
                } else {
                    await prisma.stravaProfiles.create({
                        data: {
                            userId: userId,
                            activities: data,
                        },
                    }).then(async () => {
                        console.log("Add User athlete stat successfully!")
                        await prisma.$disconnect()
                    })
                }
            }).catch(async(error) => {
                await prisma.$disconnect()
                console.log(error)
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