const Reservation = require('../models/reservation')

const ROLE = {
  ADMIN: 'admin',
  BASIC: 'basic'
}

async function scopedReservations(user) {
  if (user.role === ROLE.ADMIN) return Reservation.find({})
  const reservations = await Reservation.find({ owner: user._id })
  // console.log(reservations)
  return reservations
}

module.exports = {
  scopedReservations
}