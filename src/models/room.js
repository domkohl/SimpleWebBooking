//Model pro pokoj
const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
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
const Room = mongoose.model('Room', roomSchema)
module.exports = Room