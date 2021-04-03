const express = require('express')




const app = express()
const port = process.env.PORT || 3000
app.use(express.json())
const path = require("path")
///////////////////////////////////////////

const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/ubytovaciZarizeni', {
    useNewUrlParser: true,
    useCreateIndex: true, 
    useUnifiedTopology: true
})


//////////////////////////////////////////////
// const hbs = require("hbs")

// const publicDirectoryPath = path.join(__dirname,"../public")
// app.use(express.static(publicDirectoryPath))


app.set("view engine","hbs")
const viewspath = path.join(__dirname,"../views")
app.set("views",viewspath)



app.get("/login",(req,res)=>{
    res.render("login.hbs")
})

app.get("/register",(req,res)=>{
    res.render("register.hbs")
})


// router.post('/users', async (req, res) => {
//     const user = new User(req.body)
//     try {
//         await user.save()
//         const token = await user.generateAuthToken()
//         res.status(201).send({ user, token })
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })









app.listen(port, () => {
    console.log('Server poslouchá na portu ' + port)
})