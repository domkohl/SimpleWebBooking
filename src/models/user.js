//Model pro uživatele

const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const ROLE = {
    ADMIN: 'admin',
    BASIC: 'basic'
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Neplatná mailová adresa!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isStrongPassword(value, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 })) {
                throw new Error('Heslo musí být délky min. 8 a obsahovat: 1 malé písmeno, 1 velké písmeno a jednu číslici.')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Věk musí být kladné číslo!')
            }
        }
    },
    adress: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        required: true,
        default: ROLE.BASIC
    },
    tokens: [{
        token: {
            type: String,
        }
    }]
}, { collection: "users" })

// Funkce generuje token a nahraje ho do databáze
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ id: user._id }, 'Valentýn')
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}
// Funkce pro nalezení uživatele
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Přihlášení selhalo - údaje neodpovídají')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Přihlášení selhalo - údaje neodpovídají')
    }
    return user
}
// Před uloženi zašifruj heslo, pokud bylo změněno
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10)
    }
    next()
})
// Před odeslání informací o uživateli modifikuji co chci odeslat
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.role
    return userObject
}
const User = mongoose.model('User', userSchema)

module.exports = User