const homeVisitAppointmentModel = require("../models/homeVisitAppointmentModel")

async function updateHomeVisitAppointmentController(req,res) {
    
    try{
             
                const {_id, ...resBody} = req.body     
    
                const updateHomeVisitAppointment = await homeVisitAppointmentModel.findByIdAndUpdate(_id,resBody)
    
                res.json({
                    message : "Home Visit Appointment Updated Successfully",
                    data : updateHomeVisitAppointment,
                    success : true,
                    error : false
                })
    
        }
        catch(err){
            res.status(400).json({
                message : err.message || err,
                error : true,
                success : false,
                
            })
    
        }


}

module.exports = updateHomeVisitAppointmentController