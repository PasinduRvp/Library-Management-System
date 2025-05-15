const channelingAppointmentModel = require("../models/channelingAppointmentModel")

const getChannelingAppointmentController = async(req,res) =>{
    try{
        const allChannelingAppointments = await channelingAppointmentModel.find().sort({createdAt : -1})

        res.json({
            message : "All Channeling Appointments",
            success : true,
            error : false,
            data : allChannelingAppointments
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false,
        })
    }
}


module.exports = getChannelingAppointmentController