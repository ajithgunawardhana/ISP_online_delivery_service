const mongoose = require('mongoose')


const paymentSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    address:{
        type: String
    },
    phonenumber:{
        type:Number
    },
    cardnumber:{
        type: String
    }
    
    
}, {
    timestamps: true
})


module.exports = mongoose.model("Payments", paymentSchema)