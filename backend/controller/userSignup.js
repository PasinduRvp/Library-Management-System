const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');

async function userSignUpController(req, res) {
    try {
        const { email, password, name, role = 'GENERAL', profilePic } = req.body;

        if (!email) throw new Error("Please provide email");
        if (!password) throw new Error("Please provide password");
        if (!name) throw new Error("Please provide name");

        const existingUser = await userModel.findOne({ email });
        if (existingUser) throw new Error("User already exists with this email");

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(password, salt);
        if (!hashPassword) throw new Error("Error hashing password");

        const payload = {
            email,
            name,
            password: hashPassword,
            role,
            ...(profilePic && { profilePic })
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