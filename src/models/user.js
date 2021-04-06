const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


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
        unique: true,
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
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('heslo')) {
                throw new Error('Heslo nesmí obsahovat "heslo"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            // required: true
        }
    }] 
}, {collection: "users"})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({id: user._id}, 'Valentýn')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Přihlášení selhalo - uživatel nenalezen')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Přihlášení selhalo - údaje neodpovídají')
    }

    return user
}

// userSchema.pre('save', async function (next) {
//     const user = this

//     if (user.isModified('password')) {
//         user.password = await bcrypt.hash(user.password, 8)
//     }

//     next()
// })


const User = mongoose.model('User', userSchema)

module.exports = User