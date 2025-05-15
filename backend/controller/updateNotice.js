const addNoticePermission = require("../helpers/doctorpermission")
const noticeModel = require("../models/noticeModel")

async function updateNoticeController(req,res){
    try{
         

          if(!addNoticePermission(req.userId))
                 {
                    throw new Error("Permission Denied")
                 }

            const {_id, ...resBody} = req.body     

            const updateNotice = await noticeModel.findByIdAndUpdate(_id,resBody)

            res.json({
                message : "Notice Updated Successfully",
                data : updateNotice,
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

module.exports = updateNoticeController