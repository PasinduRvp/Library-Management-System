const userModel = require("../models/userModel")

const addNoticePermission = async(userId) => {
    const user = userModel.findById(userId)

    if(user.role !== 'ADMIN' || 'DOCTOR'){
        return false
    }

    return true
}

module.exports =  addNoticePermission