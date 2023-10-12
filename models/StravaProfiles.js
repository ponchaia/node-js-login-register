const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StravaProfileSchema = new Schema({
    userId: {
        type: String,
        required: [true, 'Please provide user ID']
    },
    athlete: Object,
    athleteStat: Object,
    athleteActivities: Object,
    activities: Object,
})

const StravaProfile = mongoose.model('StravaProfiles', StravaProfileSchema)
module.exports = StravaProfile