const User = require("../models/userModel");

async function getUserById(req, res) {
    try {
        const user = await User.findById(req.params.id).select('-password -qrCode');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function getMedicalRecords(req, res) {
    try {
        const user = await User.findById(req.params.id).select('medicalRecords name');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, data: user.medicalRecords, patientName: user.name });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function updateMedicalRecord(req, res) {
    try {
        const { diagnosis, treatment, prescription, notes } = req.body;
        const newRecord = {
            doctor: req.user.name,
            diagnosis,
            treatment,
            prescription,
            notes
        };

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $push: { medicalRecords: newRecord } },
            { new: true }
        ).select('medicalRecords');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ 
            success: true, 
            message: "Medical record updated successfully",
            data: user.medicalRecords 
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

module.exports = { getUserById, getMedicalRecords, updateMedicalRecord };