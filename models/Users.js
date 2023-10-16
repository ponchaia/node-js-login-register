const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide email']
    },
    password: {
        type: String,
        required: [true, 'Please provide password']
    },
    stravaUserId: Number,
    authorizationCode: String,
    accessToken: String,
    refreshToken: String,
    tokenExpiresAt: Number,
    tokenExpiresIn: Number,
    createdAt: Date,
    updatedAt: Date,
})

Schema.pre('save', function(next) {
    const user = this

    bcrypt.hash(user.password, 10).then(hash => {
        user.password = hash
        next()
    }).catch(error => {
        console.error(error)
    })
})

Schema.pre('save', function (next) {
    if (!this.createdAt) {
      this.createdAt = this.updatedAt = new Date()
    } else {
      this.updatedAt = new Date()
    }
    next()
})

const User = mongoose.models.users || mongoose.model('Users', Schema)
module.exports = User