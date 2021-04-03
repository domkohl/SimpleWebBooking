const express = require('express')
// const mongoose = require('mongoose')
const app = express()
const port = process.env.PORT || 3000
app.use(express.json())
// mongoose.connect('mongodb://127.0.0.1:27017/ubytovaciZarizeni', {
//     useNewUrlParser: true,
//     useCreateIndex: true, 
//     useUnifiedTopology: true
// })



app.get("",(req,res)=>{
    res.render("test")
})






app.listen(port, () => {
    console.log('Server poslouchá na portu ' + port)
})