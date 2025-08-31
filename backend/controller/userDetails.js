const userModel = require('../models/userModel');

async function userDetailsController(req, res) {
    try {
        const user = await userModel.findById(req.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                data: null,
                error: true,
                success: false
            });
        }

        res.status(200).json({
            data: user,
            error: false,
            success: true,
            message: "User details fetched successfully"
        });

    } catch (err) {
        console.error("Error in userDetailsController:", err);
        res.status(500).json({
            message: err.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

module.exports = userDetailsController;