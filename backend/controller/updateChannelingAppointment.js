const channelingAppointmentModel = require("../models/channelingAppointmentModel")

async function updateChannelingAppointmentController(req,res) {
    
    try{
             
                const {_id, ...resBody} = req.body     
    
                const updateChannelingAppointment = await channelingAppointmentModel.findByIdAndUpdate(_id,resBody)
    
                res.json({
                    message : "Channeling Appointment Updated Successfully",
                    data : updateChannelingAppointment,
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

module.exports = updateChannelingAppointmentController