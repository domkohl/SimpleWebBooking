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

const bcrypt = require("bcryptjs")
const User = require('./models/user')
const jwt = require("jsonwebtoken")
const auth = require('./middleware/auth')

//////////////////////////////////////////////
// const hbs = require("hbs")

const publicDirectoryPath = path.join(__dirname,"../public")
app.use(express.static(publicDirectoryPath))

app.set("view engine","hbs")
const viewspath = path.join(__dirname,"../views")
app.set("views",viewspath)


////////////////////////////////////////////////////////

const userRouter = require('./routers/user')

app.get("/",(req,res)=>{
    res.render("login.hbs")
})
// app.get("/login",(req,res)=>{
//     res.render("login.hbs")
// })

// app.get("/register",(req,res)=>{
//     res.render("register.hbs")
// })

// app.get("/change-password",(req,res)=>{
//     res.render("changepassword.hbs")
// })

// app.post("/api/register",async (req,res)=>{

//     const {username,email,password: password} = req.body


//     if(!username || typeof username !== "string"){
//         return res.json({status: "error",error:"Invalid username"})
//     }

//     if(!password || typeof password !== "string"){
//         return res.json({status: "error",error:"Invalid password"})
//     }

//     if(password.length < 7 ){
//         return res.json({status: "error",error:"Password is to short"})
//     }
//     try{
//         // console.log(req.body)
//         // const result = await User.create({
//         //     username,
//         //     email,
//         //     password
//         // })
//         // console.log(result)
//         const user = new User(req.body)
//         await user.save()
//     }catch(e){
//         if(e.code === 11000){
//             //duplicita jmena nebo mailu
//             return res.json({status: "error",error: "Username already in use"})
//         }
//         throw e
//     }

//     res.json({status: "ok"})
// })


// app.post("/api/login",async (req,res)=>{

//     // const {email,password} = req.body
//     //lean zrychluje .lean()
//     // const searchingUser = await User.findOne({email})

//     // if(!searchingUser){
//     //     return res.json({status: "error",error:"Invalid username or password"})
//     // }
//     // if(await bcrypt.compare(password,searchingUser.password)){
//     //     //heslo stejne
//     //     const token = await searchingUser.generateAuthToken()

//     //     return res.json({status: "ok",data:token})
//     // }
//     // const {email,password} = req.body
//     console.log(req.body)
//     try{
//         const user = await User.findByCredentials(req.body.email, req.body.password)
//         const token = await user.generateAuthToken()
//         return res.json({status: "ok",data:token})
//     }catch(e){
//         res.json({status: "error",error: e.message})
//     }
// })

// app.post("/api/changepassword",auth ,async (req,res)=>{
//     // const { token ,newPassword:noHashedPassword} = req.body
//     // console.log(req.body.user)
//     const noHashedPassword = req.body.newPassword
//     const userToChange = req.body.user

//     if(!noHashedPassword || typeof noHashedPassword !== "string"){
//         return res.json({status: "error",error:"Invalid password"})
//     }

//     if(noHashedPassword.length < 7 ){
//         return res.json({status: "error",error:"Password is to short"})
//     }

//     try{
//         // const userChange = jwt.verify(token, "Valentýn")
//         //... muzu zmenit heslo
//         // console.log(userChange)
//         // const _id = userChange.id
//         // const hashedPassword = await bcrypt.hash(noHashedPassword,10)
//         userToChange.password = noHashedPassword
//         userToChange.save()
//         // await User.updateOne ({_id},{
//         //     $set:{password: hashedPassword}
//         // })
//     }catch(e){
//         console.log(e)
//         res.json({status: "error",error:"No way possible"})
//     }

//     res.json({status:"ok"})
// })

// app.get('/users/me', auth, async (req, res) => {
//     // console.log(req.body.user.username)
//     res.render('user.hbs', {
//         username: req.body.user.username
//         // tasks: tasks,
//         // user: req.user.name
//     })
// })



app.use(userRouter)

app.listen(port, () => {
    console.log('Server poslouchá na portu ' + port)
})