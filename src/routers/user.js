// Router tykacíjí se uživatele
const express = require('express')
const User = require('../models/user')
const { auth, authenticateTokenHead } = require('../middleware/auth')
const { scopedReservations } = require('../helpFunctions/help')

const router = new express.Router()

// Vykreslení stránky pro login
router.get("/login", (req, res) => {
    res.render("login.hbs")
})
// Vykreslení stránky pro registraci
router.get("/register", (req, res) => {
    res.render("register.hbs")
})
// Vykreslení stránky profil
router.get("/profil", (req, res) => {
    res.render("user.hbs")
})

// Registrae uživatele
router.post("/api/register", async (req, res) => {

    const { username, email, password: password } = req.body

    if (!username || typeof username !== "string") {
        return res.send({ status: "error", error: "Špatné jméno" })
    }
    try {
        const user = new User(req.body)
        user.role = "basic"
        await user.save()
    } catch (e) {
        //duplicita jmena nebo mailu
        if (e.code === 11000) {
            if (e.keyValue.email != null) {
                return res.send({ status: "error", error: "Emailová adresa již používána" })
            } else {
                return res.send({ status: "error", error: "Jméno již používáno" })
            }
        } else {
            return res.send({ status: "error", error: e.message })
        }
    }
    res.send({ status: "ok" })
})

// Prihlášení uživatele
router.post("/api/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        return res.send({ status: "ok", data: token })
    } catch (e) {
        res.send({ status: "error", error: e.message })
    }
})

// Authorizace, vrácení informaci o uživateli a jeho rezervace
router.get('/users/me', authenticateTokenHead, async (req, res) => {
    const reservations = await scopedReservations(req.body.user)
    res.send({ user: req.body.user, reservation: reservations })
})

// Authorizace uživatele a změna povolených údajů
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body.params)
    const allowedUpdates = ['username', 'email', 'password', 'age', "adress"]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Neplatná aktualizace!' })
    }
    try {
        updates.forEach((update) => req.body.user[update] = req.body.params[update])
        await req.body.user.save()
        res.send({ status: "ok" })
    } catch (e) {
        res.send({ status: "error", error: e.message })
    }

})

// odhlášení uživatele
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.body.user.tokens = req.body.user.tokens.filter((token) => {
            return token.token !== req.body.token
        })
        await req.body.user.save()
        res.send({ status: "ok" })
    } catch (e) {
        res.status(500).send()
    }
})

// odhlášení uživatele ze všech zařízení
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.body.user.tokens = []
        await req.body.user.save()
        res.send({ status: "ok" })
    } catch (e) {
        res.status(500).send()
    }
})




module.exports = router