const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const Reservation = require('../models/reservation')

const router = new express.Router()
router.post("/api/reservation",auth,async (req,res)=>{

    const {checkIn,checkOut,status} = req.body
    const owner = req.body.user._id

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if(checkInDate>=checkOutDate){
        res.json({status:"error",error:"Spatne zadaní termínu"})
        return
    }

    try {
        const test =  await Reservation.find({"checkIn": {$lt: checkOutDate}, "checkOut": {$gt: checkInDate}})

    if(!test.length == 0){
        res.json({status:"error",error:"Vybráný termín nebo jeho část je již rezervována"})
        return
    }

    console.log(test.length)

    const result = await Reservation.create({
            checkIn,
            checkOut,
            status,
            owner
    })
    res.json({status:"ok"})
    } catch (error) {
        res.json({status:"error",error:"spatne zadani terminu"})

    }
        // // console.log(result)
        // // console.log(checkIn.type)
    //     const user = new User(req.body)
    //     await user.save()
    // res.send(req.body)
        
})




module.exports = router