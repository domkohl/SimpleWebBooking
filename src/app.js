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
///////////////////////////////

const user = require("./models/user")

const bcrypt = require("bcryptjs")
const User = require('./models/user')
const jwt = require("jsonwebtoken")

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

app.get("/change-password",(req,res)=>{
    res.render("changepassword.hbs")
})

app.post("/api/register",async (req,res)=>{


    const {username,email,password: noHashedPassword} = req.body
    const password = await bcrypt.hash(noHashedPassword,10)

    if(!username || typeof username !== "string"){
        return res.json({status: "error",error:"Invalid username"})
    }

    if(!noHashedPassword || typeof noHashedPassword !== "string"){
        return res.json({status: "error",error:"Invalid password"})
    }

    if(noHashedPassword.length < 7 ){
        return res.json({status: "error",error:"Password is to short"})
    }
    try{
        const result = await User.create({
            username,
            email,
            password
        })
        console.log(result)
    }catch(e){
        if(e.code === 11000){
            //duplicita jmena nebo mailu
            return res.json({status: "error",error: "Username already in use"})
        }
        throw e
    }


    res.json({status: "ok"})

})


app.post("/api/login",async (req,res)=>{

    const {email,password} = req.body



    //lean zrychluje
    const searchingUser = await user.findOne({email}).lean()

    if(!searchingUser){
        return res.json({status: "error",error:"Invalid username or password"})
    }

    if(await bcrypt.compare(password,searchingUser.password)){
        //heslo stejne
        const token = jwt.sign({id: searchingUser._id,username: searchingUser.username},"ddasdsada")

        return res.json({status: "ok",data:token})
    }
    res.json({status: "error",error:"Invalid username or password"})

})

app.post("/api/changepassword",async (req,res)=>{
    const { token ,newPassword:noHashedPassword} = req.body

    if(!noHashedPassword || typeof noHashedPassword !== "string"){
        return res.json({status: "error",error:"Invalid password"})
    }

    if(noHashedPassword.length < 7 ){
        return res.json({status: "error",error:"Password is to short"})
    }

    try{
        const userChange = jwt.verify(token, "ddasdsada")
        //... muzu zmenit heslo
        const _id = userChange.id
        const hashedPassword = await bcrypt.hash(noHashedPassword,10)
        await user.updateOne ({_id},{
            $set:{password: hashedPassword}
        })
    }catch(e){
        console.log(e)
        res.json({status: "error",error:"No way possible"})
    }

    res.json({status:"ok"})
})





app.listen(port, () => {
    console.log('Server poslouchá na portu ' + port)
})