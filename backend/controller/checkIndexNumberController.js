// controllers/userController.js
const userModel = require('../models/userModel');

async function checkIndexNumber(req, res) {
    try {
        const { indexNumber } = req.query;
        
        if (!indexNumber) {
            return res.status(400).json({
                message: "Index number is required",
                error: true,
                success: false
            });
        }

        const existingUser = await userModel.findOne({ indexNumber });
        
        res.status(200).json({
            exists: !!existingUser,
            success: true,
            error: false
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || "Error checking index number",
            error: true,
            success: false
        });
    }
}


module.exports = checkIndexNumber;