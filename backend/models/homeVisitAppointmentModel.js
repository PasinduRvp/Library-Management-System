const mongoose = require('mongoose')

const homeVisitAppointmentSchema = mongoose.Schema({
    doctorName : String,
    date : Date,
    patientName : String,
    contactNo : Number,
    email : String,
    address : String,
    otherNotes : String
},{
    timestamps : true
})

const homeVisitAppointmentModel = mongoose.model("homeVisitAppointment",homeVisitAppointmentSchema)

module.exports = homeVisitAppointmentModel