const express = require("express");
const router = express.Router();
const channelingAppointmentModel = require("../models/channelingAppointmentModel");

// Delete channeling appointment
 async function deleteChannelingAppointment(req, res){
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "Appointment ID is required." });
        }

        const deletedAppointment = await channelingAppointmentModel.findByIdAndDelete(id);

        if (!deletedAppointment) {
            return res.status(404).json({ success: false, message: "Appointment not found." });
        }

        res.json({ success: true, message: "Appointment deleted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

module.exports = deleteChannelingAppointment;
