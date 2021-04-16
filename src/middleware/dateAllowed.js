const Reservation = require('../models/reservation')
const Room = require('../models/room')

// Pomocná metoda middleware zjistí, zda je možné vytvořit termín
async function dateAllowed(req, res, next) {
    const { checkIn, checkOut } = req.body

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
        res.json({ status: "error", error: "Špatné zadaní termínu" })
        return
    }
    const roomExist = await Room.findOne({ _id: req.body.room })
    if (roomExist === null) {
        res.json({ status: "error", error: "Pokoj nenalezen" })
        return
    }
    try {
        //Zjistím zda termín nezasahuje do jiného termínu
        const test = await Reservation.find({ "checkIn": { $lt: checkOutDate }, "checkOut": { $gt: checkInDate }, "room": req.body.room, "status": "pending" })
        const test2 = await Reservation.find({ "checkIn": { $lt: checkOutDate }, "checkOut": { $gt: checkInDate }, "room": req.body.room, "status": "approved" })
        test2.forEach(x => test.push(x))

        if (!test.length == 0) {
            res.json({ status: "error", error: "Vybráný termín nebo jeho část je již rezervována" })
            return
        }

    } catch (error) {
        res.json({ status: "error", error: "Špatné zadaní termínu" })
    }
    next()
}




module.exports = { dateAllowed }