// models/userModel.js - Updated
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "GENERAL"], default: "GENERAL" },
    profilePic: { type: String },
    registrationNumber: { type: String, unique: true },
    contactNumber: { type: String },
    address: { type: String },
    // New fields for membership
    membershipStatus: { 
      type: String, 
      enum: ["PENDING", "ACTIVE", "EXPIRED", "SUSPENDED"], 
      default: "PENDING" 
    },
    membershipExpiry: { type: Date },
    membershipPayment: {
      slipImage: { type: String },
      uploadedAt: { type: Date },
      approvedAt: { type: Date },
      approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    fines: { type: Number, default: 0 },
    reservationLimit: { type: Number, default: 2 },
    qrCode: { type: String } // Store QR code data or path
  },
  { timestamps: true }
);

// ... rest of the user model code remains the same

// Pre-save middleware to generate registration number based on role
userSchema.pre('save', async function(next) {
  if (this.isNew && !this.registrationNumber) {
    try {
      let prefix = 'BN';
      let startingNumber = 1001;
      
      if (this.role === 'ADMIN') {
        prefix = 'BN_ADM';
        startingNumber = 101;
        
        const lastAdmin = await this.constructor.findOne(
          { role: 'ADMIN', registrationNumber: { $regex: /^BN_ADM\d+$/ } },
          { registrationNumber: 1 },
          { sort: { createdAt: -1 } }
        );
        
        if (lastAdmin && lastAdmin.registrationNumber) {
          const lastNumber = parseInt(lastAdmin.registrationNumber.replace('BN_ADM', ''));
          startingNumber = lastNumber + 1;
        }
      } else {
        const lastUser = await this.constructor.findOne(
          { role: 'GENERAL', registrationNumber: { $regex: /^BN\d+$/ } },
          { registrationNumber: 1 },
          { sort: { createdAt: -1 } }
        );
        
        if (lastUser && lastUser.registrationNumber) {
          const lastNumber = parseInt(lastUser.registrationNumber.replace('BN', ''));
          startingNumber = lastNumber + 1;
        }
      }
      
      this.registrationNumber = `${prefix}${startingNumber}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;