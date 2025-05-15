const homeVisitAppointmentModel = require("../models/homeVisitAppointmentModel")

async function AddHomeVisitAppoiintmentController(req,res) {
    try{
         const addHomeVisitAppointment = new homeVisitAppointmentModel(req.body)
         const saveHomeVisitAppointment = await addHomeVisitAppointment.save()
         
         res.status(201).json({
            message : "Home Visit Appointment Created Successfully !",
            error : false,
            success : true,
            data : saveHomeVisitAppointment
         })
         
    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false,
        })
    }
    
}

module.exports = AddHomeVisitAppoiintmentController