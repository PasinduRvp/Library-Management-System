const userModel = require("../models/userModel");

async function updateUser(req, res) {
    try {
        const sessionUser = req.userId;
        const { userId, email, name, role, profilePic, contactNumber, address } = req.body;

        // Build the update payload
        const payload = {
            ...(email && { email: email }),
            ...(name && { name: name }),
            ...(role && { role: role }),
            ...(profilePic && { profilePic: profilePic }),
            ...(contactNumber !== undefined && { contactNumber: contactNumber }),
            ...(address !== undefined && { address: address }),
        };

        const updateUser = await userModel.findByIdAndUpdate(userId, payload, { new: true });

        res.json({
            data: updateUser,
            message: "User Updated",
            success: true,
            error: false,
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = updateUser;