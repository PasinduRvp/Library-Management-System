const homeVisitAppointmentModel = require("../models/homeVisitAppointmentModel")

const getHomeVisitAppointmentController = async(req,res) =>{
    try{
        const allHomeVisitAppointments = await homeVisitAppointmentModel.find().sort({createdAt : -1})

        res.json({
            message : "All Home Visit Appointments",
            success : true,
            error : false,
            data : allHomeVisitAppointments
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false,
        })
    }
}


module.exports = getHomeVisitAppointmentController