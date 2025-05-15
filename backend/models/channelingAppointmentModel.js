const mongoose = require('mongoose')

const channelingAppointmentSchema = mongoose.Schema({
    doctorName : String,
    date : Date,
    patientName : String,
    contactNo : Number,
    email : String,
    otherNotes : String
},{
    timestamps : true
})

const channelingAppointmentModel = mongoose.model("channelingAppointment",channelingAppointmentSchema)

module.exports = channelingAppointmentModel