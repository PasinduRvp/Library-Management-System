const userModel = require("../models/userModel")

const addChannelingAppointmentPermission = async(userId) => {
    const user = userModel.findById(userId)

    if(user.role !== 'ADMIN'){
        return false
    }

    return true
}

module.exports =  addChannelingAppointmentPermission