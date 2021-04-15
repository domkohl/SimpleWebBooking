//Model pro pokoj

const mongoose = require('mongoose')
const Room = mongoose.model('Room', {
  name: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true,
  },
})
module.exports = Room