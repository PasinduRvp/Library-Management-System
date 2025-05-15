const noticeModel = require("../models/noticeModel")

const getNoticeController = async(req,res)=>{
    try{
        const allNotices = await noticeModel.find().sort({createdAt : -1})

        res.json({
            message : "All Product",
            success : true,
            error : false,
            data : allNotices
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false,
        })
    }
}

module.exports = getNoticeController
