const channelingAppointmentModel = require("../models/channelingAppointmentModel")

async function AddChannelingAppoiintmentController(req,res) {
    try{
         const addChannelingAppointment = new channelingAppointmentModel(req.body)
         const saveChannelingAppointment = await addChannelingAppointment.save()
         
         res.status(201).json({
            message : "Channeling Appointment Created Successfully !",
            error : false,
            success : true,
            data : saveChannelingAppointment
         })
         
    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false,
        })
    }
    
}

module.exports = AddChannelingAppoiintmentController