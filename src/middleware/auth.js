const jwt = require('jsonwebtoken')
const User = require('../models/user')
//Funkce pro authorizaci uživatele pomocí body
const auth = async (req, res, next) => {
    try {
        const token = req.body.token
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

// Pomocná metoda middleware pro autorizaci pomocí hlavičky
async function authenticateTokenHead(req, res, next) {
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

module.exports = { auth, authenticateTokenHead }