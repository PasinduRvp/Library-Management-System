const addNoticePermission = require("../helpers/doctorpermission")
const noticeModel = require ("../models/noticeModel")

async function AddNoticeController(req,res) {
    try{
        const sessionUserId = req.UserId

        if(!addNoticePermission(sessionUserId))
        {
           throw new Error("Permission Denied")
        }



        const addNotice = new noticeModel(req.body)
        const saveNotice = await addNotice.save()
        
        res.status(201).json({
           message : "Notice Created Successfully !",
           error : false,
           success : true,
           data : saveNotice
        })
        
   }catch(err){
       res.status(400).json({
           message : err.message || err,
           error : true,
           success : false,
       })
   }
}

module.exports = AddNoticeController