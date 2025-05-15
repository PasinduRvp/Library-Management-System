const mongoose = require('mongoose')

const noticeSchema = mongoose.Schema({
        topic : String,
        noticeImage : [],
        description : String,

},{
    timestamp : true
})


const noticeModel = mongoose.model("notice",noticeSchema)

module.exports = noticeModel