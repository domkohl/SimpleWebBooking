const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Room = require('../models/room')

const ROLE = {
    ADMIN: 'admin',
    BASIC: 'basic'
  }

router.post("/api/room",auth,async (req,res)=>{
    if(req.body.user.role === ROLE.BASIC){
        res.json({status:"error",error:"nemás prava"})
        return
    }
    // const {name,capacity,price} = req.body
    // console.log(req.body)

    try {
    const result = new Room(req.body.params)
    await result.save()
    res.json({status:"ok"})
    } catch (error) {
        // console.log(error.message)
        res.json({status:"error",error:"spatne zadani pokoje"})

    }
        
})















module.exports = router