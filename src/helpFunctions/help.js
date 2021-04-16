// Pomocné funkce

const Reservation = require('../models/reservation')
const Room = require('../models/room')
// Uložení konstant pro role
const ROLE = {
  ADMIN: 'admin',
  BASIC: 'basic'
}
// Funkce vyhledá a vráti uživatelovi rezervace
async function scopedReservations(user) {
  // když admin vracím všechny rezervace
  if (user.role === ROLE.ADMIN) return Reservation.find({})
  const reservations = await Reservation.find({ owner: user._id })
  return reservations
}

// Zjištění zda lze rezeravce upravit
async function dateAllowedPatch(req) {
  const { checkIn, checkOut } = req.body

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkInDate >= checkOutDate) {
    throw new Error("Špatné zadaní termínu")
  }
  const roomExist = await Room.findOne({ name: req.body.room })
  if (roomExist === null) {
    throw new Error("Pokoj nenalezen")
  }
  //změním jméno pokoje na id
  req.body.room = roomExist._id
  //Zjistím zda termín nezasahuje do jiného termínu
  const test = await Reservation.find({ "checkIn": { $lt: checkOutDate }, "checkOut": { $gt: checkInDate }, "room": req.body.room, "status": "pending" })
  const test2 = await Reservation.find({ "checkIn": { $lt: checkOutDate }, "checkOut": { $gt: checkInDate }, "room": req.body.room, "status": "approved" })
  test2.forEach(x => test.push(x))

  if (!test.length == 0) {
    throw new Error("Vybráný termín nebo jeho část je již rezervována")
  }
}

module.exports = {
  scopedReservations,
  dateAllowedPatch,
  ROLE
}