
const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { scopedReservations } = require('../permissions/reservations')

const router = new express.Router()

router.get("/login",(req,res)=>{
    res.render("login.hbs")
})

router.get("/register",(req,res)=>{
    res.render("register.hbs")
})

router.get("/profil",(req,res)=>{
    res.render("user.hbs")
})


router.post("/api/register",async (req,res)=>{

    const {username,email,password: password} = req.body


    if(!username || typeof username !== "string"){
        return res.json({status: "error",error:"Invalid username"})
    }

    try{
        // console.log(req.body)
        // const result = await User.create({
        //     username,
        //     email,
        //     password
        // })
        // console.log(result)
        const user = new User(req.body)
        user.role = "basic"
        await user.save()
    }catch(e){
        if(e.code === 11000){
            //duplicita jmena nebo mailu
            return res.json({status: "error",error: "Username already in use"})
        }else{
            console.log(e.message)
            return res.json({status: "error",error: e.message})
        }
    }

    res.json({status: "ok"})
})


router.post("/api/login",async (req,res)=>{

    // const {email,password} = req.body
    //lean zrychluje .lean()
    // const searchingUser = await User.findOne({email})

    // if(!searchingUser){
    //     return res.json({status: "error",error:"Invalid username or password"})
    // }
    // if(await bcrypt.compare(password,searchingUser.password)){
    //     //heslo stejne
    //     const token = await searchingUser.generateAuthToken()

    //     return res.json({status: "ok",data:token})
    // }
    // const {email,password} = req.body
    console.log(req.body)
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        return res.json({status: "ok",data:token})
    }catch(e){
        res.json({status: "error",error: e.message})
    }
})

router.post("/api/changepassword",auth ,async (req,res)=>{
    // const { token ,newPassword:noHashedPassword} = req.body
    // console.log(req.body.user)
    const noHashedPassword = req.body.newPassword
    const userToChange = req.body.user

    if(!noHashedPassword || typeof noHashedPassword !== "string"){
        return res.json({status: "error",error:"Invalid password"})
    }

    if(noHashedPassword.length < 7 ){
        return res.json({status: "error",error:"Password is to short"})
    }

    try{
        // const userChange = jwt.verify(token, "Valentýn")
        //... muzu zmenit heslo
        // console.log(userChange)
        // const _id = userChange.id
        // const hashedPassword = await bcrypt.hash(noHashedPassword,10)
        userToChange.password = noHashedPassword
        userToChange.save()
        // await User.updateOne ({_id},{
        //     $set:{password: hashedPassword}
        // })
    }catch(e){
        console.log(e)
        res.json({status: "error",error:"No way possible"})
    }

    res.json({status:"ok"})
})

router.get('/users/me',authenticateToken, async (req, res) => {
    // console.log(req.body.user.username)
    // console.log(scopedReservations(req.body.user))
    // console.log(req._id)
//predelat

    // res.send('user.hbs', {
    //     username: req.body.user.username,
    //     reservations: await scopedReservations(req.body.user)
    //     // user: req.user.name
    // })
    res.send({user: req.body.user ,reservation: await scopedReservations(req.body.user)})
})

router.patch('/users/me', auth, async (req, res) => {
    // console.log(req.body.params)
    const updates = Object.keys(req.body.params)
    const allowedUpdates = ['username', 'email', 'password', 'age', "adress"]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    console.log(isValidOperation)
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Neplatná aktualizace!' })
    }

    try {
        updates.forEach((update) => req.body.user[update] = req.body.params[update])
        await req.body.user.save()
        res.json({status:"ok"})
    } catch (e) {
        console.log(e.message)
        res.send({status: "error",error: e.message})
    }

})

const jwt = require('jsonwebtoken')

async function authenticateToken(req, res, next) {
    // console.log(req.headers)
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    try {
        const decoded = jwt.verify(token, 'Valentýn')
        const user = await User.findOne({ _id: decoded.id, 'tokens.token': token })
    
        if (!user) {
            throw new Error()
        }

        // console.log(req.body)
        req.body.token = token
        req.body.user = user
        // console.log(req.body)
        next()
    } catch (e) {
        res.status(401).send({ error: 'Prokažte svou totožnost.' })
    }
  }

// odhlášení uživatele
router.post('/users/logout', auth, async (req, res) => {   
    console.log(req.body)
    try {
        req.body.user.tokens = req.body.user.tokens.filter((token) => {
            // console.log('Porovnávám token.token ('+token.token+') s req.token ('+req.body.token+')')
            return token.token !== req.body.token
        })
        
        await req.body.user.save()

        res.send({status:"ok"})
    } catch (e) {
        res.status(500).send()
    }
})

// odhlášení uživatele ze všech zařízení
router.post('/users/logoutAll', auth, async (req, res) => {

    try {
        req.body.user.tokens = []
        await req.body.user.save()
        res.send({status:"ok"})
    } catch (e) {
        res.status(500).send()
    }
})





module.exports = router