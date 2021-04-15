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

module.exports = auth