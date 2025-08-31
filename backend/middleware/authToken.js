// middleware/authToken.js
const jwt = require('jsonwebtoken')

async function authToken(req, res, next){
    try{
        const token = req.cookies?.token 

        console.log("Auth Token Middleware - Token found:", !!token);
        if(!token){
            return res.status(401).json({
                message: "Please login to access this resource",
                error: true,
                success: false
            })
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, function(err, decoded) {
            if(err){
                console.log("JWT Verification Error:", err.message);
                return res.status(401).json({
                    message: "Invalid or expired token",
                    error: true,
                    success: false
                })
            }

            console.log("JWT Decoded User ID:", decoded?._id);
            req.userId = decoded?._id;
            next();
        });

    }catch(err){
        console.log("Auth Token Middleware Error:", err.message);
        res.status(500).json({
            message: "Internal server error",
            error: true,
            success: false
        })
    }
}

module.exports = authToken;