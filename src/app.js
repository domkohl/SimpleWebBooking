// Hlavní script
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
app.use(express.json())
const path = require("path")
const hbs = require('hbs')

const mongoose = require('mongoose')
//Pripojeni do databaze
mongoose.connect('mongodb://127.0.0.1:27017/ubytovaciZarizeni', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
//cesty
const publicDirectoryPath = path.join(__dirname, "../public")
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
app.use(express.static(publicDirectoryPath))

hbs.registerPartials(partialsPath)
app.set("view engine", "hbs")
app.set("views", viewsPath)

// Routovani
const userRouter = require('./routers/user')
const reservationRouter = require('./routers/reservation')
const roomRouter = require('./routers/room')

//Vykreslení hlavní stránky
app.get("/", (req, res) => {
    res.render("index.hbs")
})
//Routy
app.use(userRouter)
app.use(reservationRouter)
app.use(roomRouter)

app.listen(port, () => {
    console.log('Server poslouchá na portu ' + port)
})