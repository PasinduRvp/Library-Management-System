const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
    try {
        console.log('=== AUTH TOKEN MIDDLEWARE ===');
        console.log('Request URL:', req.url);
        console.log('Request method:', req.method);
        console.log('Request headers:', req.headers);

        // Check for token in multiple locations
        let token = null;

        // 1. Check Authorization header (Bearer token)
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.substring(7);
            console.log("Token found in Authorization header");
        }
        // 2. Check cookies
        else if (req.cookies?.token) {
            token = req.cookies.token;
            console.log("Token found in cookies");
        }
        // 3. Check query parameter (for debugging)
        else if (req.query.token) {
            token = req.query.token;
            console.log("Token found in query parameters");
        }

        console.log("Token found:", !!token);
        
        if (!token) {
            console.log("No authentication token provided");
            return res.status(401).json({
                message: "Authentication required. Please login to access this resource.",
                error: true,
                success: false,
                code: "NO_TOKEN"
            });
        }

        // Verify the token
        jwt.verify(token, process.env.TOKEN_SECRET_KEY, function (err, decoded) {
            if (err) {
                console.log("JWT Verification Error:", err.message);
                console.log("Token that failed:", token);
                
                // Clear invalid token cookie if it exists
                if (req.cookies?.token) {
                    res.clearCookie('token', {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
                    });
                }
                
                let errorMessage = "Invalid or expired token";
                let errorCode = "INVALID_TOKEN";
                
                if (err.name === 'TokenExpiredError') {
                    errorMessage = "Session expired. Please login again.";
                    errorCode = "TOKEN_EXPIRED";
                } else if (err.name === 'JsonWebTokenError') {
                    errorMessage = "Invalid authentication token.";
                    errorCode = "MALFORMED_TOKEN";
                }

                return res.status(401).json({
                    message: errorMessage,
                    error: true,
                    success: false,
                    code: errorCode
                });
            }

            console.log("JWT Decoded successfully:", {
                userId: decoded?._id,
                email: decoded?.email,
                exp: new Date(decoded.exp * 1000).toISOString(),
                iat: new Date(decoded.iat * 1000).toISOString()
            });
            
            // Attach user information to request
            req.userId = decoded?._id;
            req.userEmail = decoded?.email;
            req.user = decoded;
            
            next();
        });

    } catch (err) {
        console.log("Auth Token Middleware Unexpected Error:", err.message);
        console.log("Error stack:", err.stack);
        
        res.status(500).json({
            message: "Internal authentication server error",
            error: true,
            success: false,
            code: "AUTH_SERVER_ERROR"
        });
    }
}

module.exports = authToken;