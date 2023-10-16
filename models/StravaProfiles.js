const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'Please provide user ID']
    },
    athlete: Object,
    athleteStat: Object,
    athleteActivities: Object,
    activities: Object,
    createdAt: Date,
    updatedAt: Date,
})

Schema.pre('save', function (next) {
    if (!this.createdAt) {
      this.createdAt = this.updatedAt = new Date()
    } else {
      this.updatedAt = new Date()
    }
    next()
})

const StravaProfiles = mongoose.models.stravaprofiles || mongoose.model('StravaProfiles', Schema)
module.exports = StravaProfiles