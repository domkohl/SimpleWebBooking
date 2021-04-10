const mongoose = require('mongoose')

const Reservation = mongoose.model('Reservation', {
    checkIn: {
        type: Date,
        require: true
      },
    checkOut: {
        type: Date,
        require: true
      },
    status: {
        type: String,
        require: true,
        enum: ['pending','approved']
      },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    room:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Room'
    }
})

// const Reservation = mongoose.model('Reservation', userSchema)
module.exports = Reservation