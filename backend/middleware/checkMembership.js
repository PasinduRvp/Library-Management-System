// middleware/checkMembership.js - New file
const User = require("../models/userModel");

async function checkMembership(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.membershipStatus !== "ACTIVE") {
      return res.status(403).json({ 
        success: false, 
        message: "Membership required. Please complete your membership payment." 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = checkMembership;