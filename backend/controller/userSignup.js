const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');

async function userSignUpController(req, res) {
    try {
        const { email, password, name, role = 'GENERAL', indexNumber, year, semester, profilePic } = req.body;

        if (!email) throw new Error("Please provide email");
        if (!password) throw new Error("Please provide password");
        if (!name) throw new Error("Please provide name");

        const existingUser = await userModel.findOne({ email });
        if (existingUser) throw new Error("User already exists with this email");

        if (role === 'STUDENT') {
            if (!indexNumber) throw new Error("Index number is required for students");
            if (!year) throw new Error("Year is required for students");
            if (!semester) throw new Error("Semester is required for students");
            
            const existingIndex = await userModel.findOne({ indexNumber });
            if (existingIndex) throw new Error("Index number already in use");
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(password, salt);
        if (!hashPassword) throw new Error("Error hashing password");

        const payload = {
            email,
            name,
            password: hashPassword,
            role,
            ...(profilePic && { profilePic }),
            ...(role === 'STUDENT' && { 
                indexNumber,
                year,
                semester 
            })
        };

        const userData = new userModel(payload);
        const saveUser = await userData.save();

        res.status(201).json({
            data: saveUser,
            success: true,
            error: false,
            message: "User Created Successfully!"
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || "Error creating user",
            error: true,
            success: false,
        });
    }
}

module.exports = userSignUpController;