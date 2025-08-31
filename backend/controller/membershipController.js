// controller/membershipController.js - COMPLETE FIX
const User = require("../models/userModel");
const fs = require("fs");
const path = require("path");

async function uploadMembershipSlip(req, res) {
  try {
    const userId = req.userId;
    const { expiryDate } = req.body;
    
    console.log("=== UPLOAD MEMBERSHIP SLIP ===");
    console.log("User ID:", userId);
    console.log("File received:", req.file ? req.file.filename : "No file");
    console.log("Expiry date:", expiryDate);
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "Please upload a payment slip" 
      });
    }

    // Find current user first
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    console.log("Current user status before update:", currentUser.membershipStatus);

    const slipImage = `/uploads/${req.file.filename}`;
    const membershipExpiry = expiryDate ? 
      new Date(expiryDate) : 
      new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    
    // FIXED: Use $set to ensure proper update
    const updateResult = await User.updateOne(
      { _id: userId },
      {
        $set: {
          membershipStatus: "PENDING", // Explicitly set to PENDING
          membershipExpiry: membershipExpiry,
          "membershipPayment.slipImage": slipImage,
          "membershipPayment.uploadedAt": new Date(),
          "membershipPayment.approvedAt": null,
          "membershipPayment.approvedBy": null
        }
      }
    );

    console.log("Update result:", updateResult);

    // Verify the update
    const updatedUser = await User.findById(userId);
    console.log("User after update:", {
      id: updatedUser._id,
      name: updatedUser.name,
      membershipStatus: updatedUser.membershipStatus,
      slipImage: updatedUser.membershipPayment?.slipImage,
      uploadedAt: updatedUser.membershipPayment?.uploadedAt
    });

    // Double-check by querying for pending users
    const pendingCheck = await User.find({ membershipStatus: "PENDING" }).select('name membershipStatus');
    console.log("Current pending users after update:", pendingCheck.length);
    
    res.json({ 
      success: true, 
      message: "Membership slip uploaded successfully! Please wait for admin approval.",
      data: updatedUser 
    });
    
  } catch (err) {
    console.error("Error uploading membership slip:", err);
    
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
        console.log("Cleaned up uploaded file due to error");
      } catch (unlinkErr) {
        console.error("Error deleting file:", unlinkErr);
      }
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Error uploading membership slip: " + err.message 
    });
  }
}

async function approveMembership(req, res) {
  try {
    const { userId } = req.body;
    const adminId = req.userId;

    console.log("=== APPROVE MEMBERSHIP ===");
    console.log("User ID to approve:", userId);
    console.log("Admin ID:", adminId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    console.log("User to approve:", {
      id: user._id,
      name: user.name,
      currentStatus: user.membershipStatus,
      hasPaymentSlip: !!user.membershipPayment?.slipImage
    });

    if (user.membershipStatus === "ACTIVE") {
      return res.status(400).json({ 
        success: false, 
        message: "User membership is already active" 
      });
    }

    if (!user.membershipPayment || !user.membershipPayment.slipImage) {
      return res.status(400).json({
        success: false,
        message: "No payment slip found for this user"
      });
    }

    // Update user membership status
    const updateResult = await User.updateOne(
      { _id: userId },
      {
        $set: {
          membershipStatus: "ACTIVE",
          "membershipPayment.approvedAt": new Date(),
          "membershipPayment.approvedBy": adminId
        }
      }
    );

    console.log("Approval update result:", updateResult);

    const updatedUser = await User.findById(userId);
    console.log("User after approval:", {
      id: updatedUser._id,
      name: updatedUser.name,
      membershipStatus: updatedUser.membershipStatus
    });
    
    res.json({ 
      success: true, 
      message: "Membership approved successfully!",
      data: updatedUser 
    });
    
  } catch (err) {
    console.error("Error approving membership:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error approving membership: " + err.message 
    });
  }
}

async function getAllPendingMemberships(req, res) {
  try {
    console.log("=== GET PENDING MEMBERSHIPS (FIXED) ===");
    
    // FIXED: More comprehensive query approach
    
    // First, find all users who have uploaded payment slips
    const usersWithPaymentSlips = await User.find({
      "membershipPayment.slipImage": { $exists: true, $ne: null, $ne: "" }
    }).select('name email registrationNumber membershipPayment membershipExpiry membershipStatus createdAt');

    console.log("Step 1 - Users with payment slips (any status):", usersWithPaymentSlips.length);

    // Filter for those who are still pending (not yet approved)
    const pendingUsers = usersWithPaymentSlips.filter(user => {
      const isPending = user.membershipStatus === "PENDING";
      const notApproved = !user.membershipPayment?.approvedAt;
      const hasSlip = user.membershipPayment?.slipImage;
      
      console.log(`User ${user.name}:`, {
        status: user.membershipStatus,
        isPending,
        notApproved,
        hasSlip: !!hasSlip,
        shouldShow: isPending || (notApproved && hasSlip)
      });
      
      // Show users who are either PENDING or have uploaded slips but not yet approved
      return (isPending || notApproved) && hasSlip;
    });

    console.log("Step 2 - Filtered pending users:", pendingUsers.length);

    // If still no results, let's check what statuses actually exist
    if (pendingUsers.length === 0) {
      console.log("=== DEBUGGING: NO PENDING USERS FOUND ===");
      
      // Check all users with payment slips and their actual statuses
      console.log("All users with payment slips and their statuses:");
      usersWithPaymentSlips.forEach(user => {
        console.log(`- ${user.name}: status="${user.membershipStatus}", approved=${!!user.membershipPayment?.approvedAt}`);
      });

      // Check if there are any users with unexpected statuses
      const allStatuses = await User.aggregate([
        {
          $match: {
            "membershipPayment.slipImage": { $exists: true, $ne: null }
          }
        },
        {
          $group: {
            _id: "$membershipStatus",
            count: { $sum: 1 },
            users: { $push: "$name" }
          }
        }
      ]);
      
      console.log("Users with payment slips by status:", allStatuses);
    }

    // Return all users with payment slips for now (to debug)
    const finalResult = pendingUsers.length > 0 ? pendingUsers : usersWithPaymentSlips;
    
    res.json({ 
      success: true, 
      data: finalResult,
      debug: {
        totalWithSlips: usersWithPaymentSlips.length,
        pendingCount: pendingUsers.length,
        queryUsed: "membershipPayment.slipImage exists and not null"
      }
    });
    
  } catch (err) {
    console.error("Error in getAllPendingMemberships:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching pending memberships: " + err.message 
    });
  }
}

// Additional helper function to fix existing data
async function fixExistingMembershipData(req, res) {
  try {
    console.log("=== FIXING EXISTING MEMBERSHIP DATA ===");
    
    // Find users who have uploaded payment slips but status might be wrong
    const usersToFix = await User.find({
      "membershipPayment.slipImage": { $exists: true, $ne: null },
      $or: [
        { membershipStatus: { $ne: "PENDING" } },
        { membershipStatus: { $exists: false } }
      ]
    });

    console.log("Users to fix:", usersToFix.length);

    for (const user of usersToFix) {
      // Only set to PENDING if not already ACTIVE
      if (user.membershipStatus !== "ACTIVE") {
        await User.updateOne(
          { _id: user._id },
          { $set: { membershipStatus: "PENDING" } }
        );
        console.log(`Fixed status for user: ${user.name}`);
      }
    }

    res.json({
      success: true,
      message: `Fixed ${usersToFix.length} users`,
      data: usersToFix.map(u => ({ name: u.name, oldStatus: u.membershipStatus }))
    });
    
  } catch (error) {
    console.error("Error fixing data:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  uploadMembershipSlip,
  approveMembership,
  getAllPendingMemberships,
  fixExistingMembershipData
};