const userModel = require("../models/userModel");

async function updateUser(req, res) {
    try {
        const sessionUser = req.userId;
        const { userId, email, name, role, indexNumber, year, semester } = req.body;

        // Build the update payload
        const payload = {
            ...(email && { email: email }),
            ...(name && { name: name }),
            ...(role && { role: role }),
        };

        // Handle student-specific fields
        if (role === 'STUDENT') {
            if (!indexNumber) throw new Error("Index number is required for students");
            if (!year) throw new Error("Year is required for students");
            if (!semester) throw new Error("Semester is required for students");

            // Check if index number is already used by another student
            const existingIndex = await userModel.findOne({ 
                indexNumber,
                _id: { $ne: userId } // Exclude current user
            });
            if (existingIndex) throw new Error("Index number already in use");

            payload.indexNumber = indexNumber;
            payload.year = year;
            payload.semester = semester;
        } else {
            // Clear student-specific fields if role is not STUDENT
            payload.indexNumber = undefined;
            payload.year = undefined;
            payload.semester = undefined;
        }

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