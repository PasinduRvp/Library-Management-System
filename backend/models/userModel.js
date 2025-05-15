const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
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
        required: function() {
            return this.role === 'STUDENT';
        }
    },
    year: {
        type: String,
        enum: ['Y1', 'Y2', 'Y3'],
        required: function() {
            return this.role === 'STUDENT';
        }
    },
    semester: {
        type: String,
        enum: ['S1', 'S2'],
        required: function() {
            return this.role === 'STUDENT';
        }
    }
}, {
    timestamps: true
});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;