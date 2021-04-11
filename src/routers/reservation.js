const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const Reservation = require('../models/reservation')
const e = require('express')
const Room = require('../models/room')

const ROLE = {
    ADMIN: 'admin',
    BASIC: 'basic'
  }

const router = new express.Router()
router.post("/api/reservation",auth,dateAllowed,async (req,res)=>{

    const {checkIn,checkOut,room} = req.body
    const owner = req.body.user._id

    try {
    const result = await Reservation.create({
            checkIn,
            checkOut,
            status:"pending",
            owner,
            room
    })
    res.json({status:"ok"})
    } catch (error) {
        // console.log(error.message)
        res.json({status:"error",error:"spatne zadani terminu"})

    }
        
})

router.delete("/api/reservation/:id",auth,async (req,res)=>{
    
    // console.log(req.body.user._id)
    // console.log(req.params.id)
    
    try {
        let reservation = await Reservation.findOneAndDelete({ _id: req.params.id, owner: req.body.user._id })
        if(req.body.user.role === ROLE.ADMIN){
            reservation = await Reservation.findOneAndDelete({ _id: req.params.id})
        }

        if (!reservation) {
            return res.status(404).send()
        }

        res.json({status:"ok",reservation})
    } catch (error) {
        console.log(error.message)
        res.json({status:"error",error:"Nepodarilo se smazat"})

    }

})

router.patch("/api/reservation/:id",auth,async (req,res)=>{
    
    // console.log(req.body.user._id)
    // console.log(req.params.id)
    let tmpCheckIn = null
    let tmpCheckOut = null
    let  tmpRes = null
    try {
        if(req.body.user.role === ROLE.ADMIN){
        tmpRes = await Reservation.findOne({ _id: req.params.id})
        const delRes = await Reservation.findOneAndUpdate({ _id: req.params.id },{checkIn:null,
            checkOut:null},{ useFindAndModify: false, new : true, runValidators : true})
        }else{
        tmpRes = await Reservation.findOne({ _id: req.params.id, owner: req.body.user._id })
        const delRes = await Reservation.findOneAndUpdate({ _id: req.params.id, owner: req.body.user._id },{checkIn:null,
            checkOut:null},{ useFindAndModify: false, new : true, runValidators : true})
        }

        if(tmpRes === null){
            throw new Error('Rezervace nenalezena')
        }
        console.log(req.body)
        tmpCheckIn = tmpRes.checkIn
        tmpCheckOut = tmpRes.checkOut
        console.log(req.body)
    
        const {checkIn,checkOut,room} = req.body

    
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
    
        if(checkInDate>=checkOutDate){
            throw new Error('Spatne zadaní termínu')
            res.json({status:"error",error:"Spatne zadaní termínu"})
            return
        }
        
        const test =  await Reservation.find({"checkIn": {$lt: checkOutDate}, "checkOut": {$gt: checkInDate},"room":room})
    
        if(!test.length == 0){
            throw new Error('Vybráný termín nebo jeho část je již rezervována')
            res.json({status:"error",error:"Vybráný termín nebo jeho část je již rezervována"})
            return
        }

        if(req.body.user.role === ROLE.ADMIN){
        
            const reservation = await Reservation.findOneAndUpdate({ _id: req.params.id},{status:req.body.status,checkIn:req.body.checkIn,
            checkOut:req.body.checkOut,room:req.body.room},{ useFindAndModify: false, new : true, runValidators : true})
                if (!reservation) {
                    throw new Error('Nenalezena rezevace v roli admin')
                    return res.status(404).send()
                }    
                res.json({status:"ok"})
        }else{
            const reservation = await Reservation.findOneAndUpdate({ _id: req.params.id},{status:"pending",checkIn:req.body.checkIn,
                checkOut:req.body.checkOut,room:req.body.room},{ useFindAndModify: false, new : true, runValidators : true})
                if (!reservation) {
                    throw new Error('Nenalezena rezevace v roli basic')
                    return res.status(404).send()
                }
                res.json({status:"ok"})
        }

    
        
    } catch (error) {
        //nemusi byt i iverini admin a id majitele ?
        const delRes = await Reservation.findOneAndUpdate({ _id: req.params.id},{checkIn:tmpCheckIn,
            checkOut:tmpCheckOut},{ useFindAndModify: false, new : true, runValidators : true})
        console.log(error.message)
        res.json({status:"error",error:error.message})

    }

})

router.get("/api/reservation-date",async (req,res)=>{

    const {checkIn,checkOut} = req.body

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if(checkInDate>=checkOutDate){
        res.json({status:"error",error:"Spatne zadaní termínu"})
        return
    }

    try {
        const toRemove =  await Reservation.find({"checkIn": {$lt: checkOutDate}, "checkOut": {$gt: checkInDate}})
        let rooms = await Room.find({})

        console.log(rooms)
        console.log(toRemove)
    if(!toRemove.length == 0){

        // const outPut = rooms.filter(x =>{
        //     return test._id.includes(x._id)
        // })
        toRemove.forEach(x => console.log(x.room))

        rooms = rooms.filter(room => !toRemove.find(reservation => (reservation.room.toString() === room._id.toString()) ))

        console.log(rooms)

        res.json(rooms)
        return
    }else{
        res.json(rooms)
    }

    } catch (error) {
        console.log(error.message)
        res.json({status:"error",error:"spatne zadani terminu"})

    }
        
})

async function dateAllowed(req,res,next){
    const {checkIn,checkOut} = req.body

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if(checkInDate>=checkOutDate){
        res.json({status:"error",error:"Spatne zadaní termínu"})
        return
    }

    try {
        const test =  await Reservation.find({"checkIn": {$lt: checkOutDate}, "checkOut": {$gt: checkInDate},"room":req.body.room})

    if(!test.length == 0){
        res.json({status:"error",error:"Vybráný termín nebo jeho část je již rezervována"})
        return
    }

    } catch (error) {
        console.log(error.message)
        res.json({status:"error",error:"spatne zadani terminu"})

    }
    next()
}


module.exports = router