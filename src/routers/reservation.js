// Router tykacíjí se rezervací
const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const Reservation = require('../models/reservation')
const Room = require('../models/room')
const ROLE = {
    ADMIN: 'admin',
    BASIC: 'basic'
}
const router = new express.Router()

// Vykreslení stránky pro editaci rezervace
router.get("/reservation/:id", async (req, res) => {
    res.render("editRezervation.hbs")
})
// Vykreslení stránky vyhledaní rezervace
router.get("/reservation", (req, res) => {
    res.render("reservation.hbs")
})

// Vytvoření rezervace, zjisím zde uživatel přihlášen, zjitím zda je termín volný a vytvořím rezervace
router.post("/api/reservation", auth, dateAllowed, async (req, res) => {
    const { checkIn, checkOut, room } = req.body
    const owner = req.body.user._id
    try {
        const result = await Reservation.create({
            checkIn,
            checkOut,
            status: "pending",
            owner,
            room
        })
        res.send({ status: "ok" })
    } catch (error) {
        console.log(error.message)
        res.send({ status: "error", error: "Spatné zadaní termínu" })
    }

})

// Smazání rezervace, uživatel musí být přihlášen, uživatel může smazat jen svou rezervaci(admin může smazat jakou chce)
router.delete("/api/reservation/:id", auth, async (req, res) => {
    try {
        let reservation = await Reservation.findOne({ _id: req.params.id, owner: req.body.user._id })
        if (req.body.user.role === ROLE.ADMIN) {
            reservation = await Reservation.findOne({ _id: req.params.id })
        }
        if (!reservation) {
            return res.status(404).send()
        }
        reservation = await Reservation.findOneAndDelete({ _id: req.params.id, owner: req.body.user._id })
        if (req.body.user.role === ROLE.ADMIN) {
            reservation = await Reservation.findOneAndDelete({ _id: req.params.id })
        }
        res.send({ status: "ok" })
    } catch (error) {
        res.send({ status: "error", error: "Nepodařilo se smazat" })
    }
})

// Authorizace a vrácení informací o jedné rezervaci, s listem všech možných pokojů
router.get("/api/reservation/:id", authenticateToken, async (req, res) => {
    try {
        let Res = await Reservation.findOne({ _id: req.params.id, owner: req.body.user._id })
        if (req.body.user.role === ROLE.ADMIN) {
            Res = await Reservation.findOne({ _id: req.params.id })
        }
        const roomName = await Room.findOne({ _id: Res.room })
        const allRooms = await Room.find({})
        const allRoomsNames = []
        allRooms.forEach(room => allRoomsNames.push(room.name))
        res.send({ checkIn: Res.checkIn, checkOut: Res.checkOut, status: Res.status, roomId: Res.room, nameRoom: roomName.name, allRoomNames: allRoomsNames })
    } catch (error) {
        res.send({ status: "error", error: "Nepodařilo se najít" })
    }
})

// Authorizace, úprava hodnot jedné rezervace + kontrola zda je rezervace možná
router.patch("/api/reservation/:id", auth, async (req, res) => {
    let tmpCheckIn = null
    let tmpCheckOut = null
    let tmpRes = null
    try {
        if (req.body.user.role === ROLE.ADMIN) {
            tmpRes = await Reservation.findOne({ _id: req.params.id })
            const delRes = await Reservation.findOneAndUpdate({ _id: req.params.id }, {
                checkIn: null,
                checkOut: null
            }, { useFindAndModify: false, new: true, runValidators: true })
        } else {
            tmpRes = await Reservation.findOne({ _id: req.params.id, owner: req.body.user._id })
            const delRes = await Reservation.findOneAndUpdate({ _id: req.params.id, owner: req.body.user._id }, {
                checkIn: null,
                checkOut: null
            }, { useFindAndModify: false, new: true, runValidators: true })
        }
        if (tmpRes === null) {
            throw new Error('Rezervace nenalezena')
        }

        tmpCheckIn = tmpRes.checkIn
        tmpCheckOut = tmpRes.checkOut

        const roomExist = await Room.findOne({ name: req.body.room })
        if (roomExist === null) {
            throw new Error('Pokoj nenalezen')
        }
        const idNewRoom = roomExist._id
        const { checkIn, checkOut } = req.body

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (checkInDate >= checkOutDate) {
            throw new Error('Špatné zadaní termínu')

        }

        const test = await Reservation.find({ "checkIn": { $lt: checkOutDate }, "checkOut": { $gt: checkInDate }, "room": idNewRoom, "status": "pending" })
        const test2 = await Reservation.find({ "checkIn": { $lt: checkOutDate }, "checkOut": { $gt: checkInDate }, "room": idNewRoom, "status": "approved" })
        test2.forEach(x => test.push(x))

        if (!test.length == 0) {
            throw new Error('Vybráný termín nebo jeho část je již rezervována')
        }

        if (req.body.user.role === ROLE.ADMIN) {
            const reservation = await Reservation.findOneAndUpdate({ _id: req.params.id }, {
                status: req.body.status, checkIn: req.body.checkIn,
                checkOut: req.body.checkOut, room: idNewRoom
            }, { useFindAndModify: false, new: true, runValidators: true })
            if (!reservation) {
                throw new Error('Nenalezena rezevace')
            }
            res.send({ status: "ok" })
        } else {
            const reservation = await Reservation.findOneAndUpdate({ _id: req.params.id }, {
                status: "pending", checkIn: req.body.checkIn,
                checkOut: req.body.checkOut, room: idNewRoom
            }, { useFindAndModify: false, new: true, runValidators: true })
            if (!reservation) {
                throw new Error('Nenalezena rezevace')
            }
            res.send({ status: "ok" })
        }
    } catch (error) {
        const delRes = await Reservation.findOneAndUpdate({ _id: req.params.id }, {
            checkIn: tmpCheckIn,
            checkOut: tmpCheckOut
        }, { useFindAndModify: false, new: true, runValidators: true })
        res.send({ status: "error", error: error.message })
    }
})

// Vyhledání volných termínů pro rezervaci pokojů
router.get("/api/reservation-date", async (req, res) => {

    const { checkin, checkout } = req.headers
    const checkInDate = new Date(checkin);
    const checkOutDate = new Date(checkout);

    if (checkInDate >= checkOutDate) {
        res.send({ status: "error", error: "Špatné zadaní termínu" })
        return
    }
    try {
        const toRemove = await Reservation.find({ "checkIn": { $lt: checkOutDate }, "checkOut": { $gt: checkInDate }, "status": "pending" })
        const toRemove2 = await Reservation.find({ "checkIn": { $lt: checkOutDate }, "checkOut": { $gt: checkInDate }, "status": "approved" })
        toRemove2.forEach(x => toRemove.push(x))
        let rooms = await Room.find({})
        if (!toRemove.length == 0) {
            toRemove.forEach(x => console.log(x.room))
            rooms = rooms.filter(room => !toRemove.find(reservation => (reservation.room.toString() === room._id.toString())))
            res.send({ rooms, status: "ok" })
            return
        } else {
            res.send({ rooms, status: "ok" })
        }
    } catch (error) {
        res.send({ status: "error", error: "Špatné zadaní termínu" })
    }
})

// Pomocná metoda middleware zjistí, zda je možné vytvořit termín
async function dateAllowed(req, res, next) {
    const { checkIn, checkOut } = req.body

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
        res.json({ status: "error", error: "Špatné zadaní termínu" })
        return
    }
    try {
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

// Pomocná metoda middleware pro autorizaci pomocí hlavičky
const jwt = require('jsonwebtoken')
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    try {
        const decoded = jwt.verify(token, 'Valentýn')
        const user = await User.findOne({ _id: decoded.id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.body.token = token
        req.body.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Prokažte svou totožnost.(Přihlašte se)' })
    }
}

module.exports = router