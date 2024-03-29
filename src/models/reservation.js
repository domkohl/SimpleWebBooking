//Model pro rezervace

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
    enum: ['pending', 'approved', "denied"]
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Room'
  }
})
module.exports = Reservation