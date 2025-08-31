// controllers/changePassword.js
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const changePassword = async (req, res) => {
    try {
        console.log('=== CHANGE PASSWORD REQUEST ===');
        console.log('User ID from token:', req.userId);
        console.log('Request body:', req.body);

        const { currentPassword, newPassword } = req.body;
        const userId = req.userId;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters long"
            });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        console.log('User found:', user.email);
        console.log('Stored password hash exists:', !!user.password);

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        console.log('Password comparison result:', isPasswordValid);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        // Check if new password is the same as current password
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        console.log('Is new password same as current:', isSamePassword);
        
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: "New password cannot be the same as current password"
            });
        }

        // Update password (the pre-save hook will hash it automatically)
        user.password = newPassword;
        await user.save();

        console.log('Password changed successfully for user:', user.email);
        
        res.json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        console.error("Error changing password:", error.message);
        res.status(500).json({
            success: false,
            message: "Error changing password. Please try again."
        });
    }
};

module.exports = changePassword;