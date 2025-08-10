const userModel = require("../models/userModel");

async function userSignUpController(req, res) {
    try {
        const { email, password, name, role = 'GENERAL', profilePic } = req.body;

        console.log("Signup request for:", email);

        // Validation
        if (!email) throw new Error("Please provide email");
        if (!password) throw new Error("Please provide password");
        if (!name) throw new Error("Please provide name");
        if (password.length < 6) throw new Error("Password must be at least 6 characters");

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) throw new Error("User already exists with this email");

        // REMOVED: Manual password hashing - let the model handle it
        // const hashPassword = await bcrypt.hash(password, 10);

        const payload = {
            email,
            name,
            password, // Pass plain password - model will hash it
            role,
            ...(profilePic && { profilePic }),
            membershipStatus: "PENDING",
            fines: 0,
            reservationLimit: 2
        };

        const userData = new userModel(payload);
        const saveUser = await userData.save();

        console.log("User created successfully:", saveUser.email);

        res.status(201).json({
            message: "User Created Successfully!",
            data: {
                _id: saveUser._id,
                name: saveUser.name,
                email: saveUser.email,
                role: saveUser.role,
                registrationNumber: saveUser.registrationNumber
            },
            success: true,
            error: false
        });

    } catch (err) {
        console.error("Signup error:", err.message);
        res.status(400).json({
            message: err.message || "Error creating user",
            error: true,
            success: false,
        });
    }
}

module.exports = userSignUpController;