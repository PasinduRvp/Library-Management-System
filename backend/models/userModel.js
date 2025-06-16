const mongoose = require("mongoose");
const qr = require('qrcode');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    profilePic: String,
    role: {
        type: String,
        required: true,
        enum: ['ADMIN', 'DOCTOR', 'STUDENT', 'NURSE', 'PHARMACY', 'LABORATORY', 'GENERAL'],
        default: 'GENERAL'
    },
    indexNumber: {
        type: String,
        unique: true,  
        sparse: true,   
        required: function() { return this.role === 'STUDENT'; }
    },
    year: {
        type: String,
        enum: ['Y1', 'Y2', 'Y3'],
        required: function() { return this.role === 'STUDENT'; }
    },
    semester: {
        type: String,
        enum: ['S1', 'S2'],
        required: function() { return this.role === 'STUDENT'; }
    },
    qrCode: String, // Store QR code data URL
    medicalRecords: [{
        date: { type: Date, default: Date.now },
        doctor: { type: String, required: true },
        diagnosis: String,
        treatment: String,
        prescription: String,
        notes: String
    }]
}, { timestamps: true });

// Generate QR code before saving
userSchema.pre('save', async function(next) {
    if (!this.qrCode) {
        try {
            const qrData = JSON.stringify({
                userId: this._id,
                name: this.name,
                indexNumber: this.indexNumber || ''
            });
            this.qrCode = await qr.toDataURL(qrData);
        } catch (err) {
            console.error('Error generating QR code:', err);
        }
    }
    next();
});

const User = mongoose.model("user", userSchema);
module.exports = User;