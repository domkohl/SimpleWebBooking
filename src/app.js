const express = require('express')

const app = express()
const port = process.env.PORT || 3000
// app.use(express.json())
const path = require("path")
const bodyParser = require("body-parser")
app.use(bodyParser.json())
///////////////////////////////////////////

const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/ubytovaciZarizeni', {
    useNewUrlParser: true,
    useCreateIndex: true, 
    useUnifiedTopology: true
})


//////////////////////////////////////////////
// const hbs = require("hbs")

const publicDirectoryPath = path.join(__dirname,"../public")
app.use(express.static(publicDirectoryPath))

app.set("view engine","hbs")
const viewspath = path.join(__dirname,"../views")
app.set("views",viewspath)


////////////////////////////////////////////////////////
app.get("/login",(req,res)=>{
    res.render("login.hbs")
})

app.get("/register",(req,res)=>{
    res.render("register.hbs")
})

app.post("/api/register",async (req,res)=>{

    console.log(req.body)
    res.json({status: "ok"})

})









app.listen(port, () => {
    console.log('Server poslouchá na portu ' + port)
})