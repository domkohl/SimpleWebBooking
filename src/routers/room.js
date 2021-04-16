// Router tykacíjí se pokoje
const express = require('express')
const router = new express.Router()
const { auth } = require('../middleware/auth')
const { ROLE } = require('../helpFunctions/help')
const Room = require('../models/room')

// Vytvoření pokoje authorizace - admin
router.post("/api/room", auth, async (req, res) => {
    if (req.body.user.role === ROLE.BASIC) {
        res.send({ status: "error", error: "Nemáš pravomoc" })
        return
    }
    try {
        const result = new Room(req.body.params)
        await result.save()
        res.send({ status: "ok" })
    } catch (error) {
        res.send({ status: "error", error: "Špatné zadaní pokoje" })
    }
})

module.exports = router