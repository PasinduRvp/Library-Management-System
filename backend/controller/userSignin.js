const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

async function userSignInController(req, res) {
    try {
        const { email, password } = req.body;

        console.log("Login attempt for:", email);

        if (!email) throw new Error("Please provide email");
        if (!password) throw new Error("Please provide password");

        const user = await userModel.findOne({ email });
        if (!user) {
            console.log("User not found:", email);
            throw new Error("User Not Found");
        }

        console.log("User found:", user.email);
        console.log("Password comparison in progress...");

        const checkPassword = await bcrypt.compare(password, user.password);
        console.log("Password check result:", checkPassword);

        if (checkPassword) {
            const tokenData = {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            };
            
            const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { 
                expiresIn: '24h' 
            });

            // Set cookie (for browser-based clients)
            const tokenOption = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 24 * 60 * 60 * 1000
            };

            // Return both cookie and token in response (for flexibility)
            res.cookie("token", token, tokenOption).json({
                message: "Login Successful",
                data: {
                    token: token,
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        profilePic: user.profilePic,
                        registrationNumber: user.registrationNumber
                    }
                },
                success: true,
                error: false,
            });

        } else {
            console.log("Invalid password for user:", email);
            throw new Error("Invalid email or password");
        }

    } catch (err) {
        console.error("Login error:", err.message);
        res.status(400).json({
            message: err.message || "An unexpected error occurred",
            error: true,
            success: false,
        });
    }
}

module.exports = userSignInController;