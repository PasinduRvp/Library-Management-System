// models/patientModel.js
const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true, enum: ["consultation", "diagnosis", "treatment", "lab_result"] },
  title: { type: String, required: true },
  description: { type: String, required: true },
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String
  }],
  notes: String,
  followUpDate: Date
}, { timestamps: true });

const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bloodType: { type: String, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"] },
  allergies: [{
    name: String,
    severity: { type: String, enum: ["Mild", "Moderate", "Severe"] },
    reaction: String
  }],
  chronicConditions: [{
    name: String,
    diagnosedDate: Date,
    status: { type: String, enum: ["Active", "In Remission", "Resolved"] }
  }],
  medicalRecords: [medicalRecordSchema],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String
  },
  insurance: {
    provider: String,
    policyNumber: String,
    expiryDate: Date
  }
}, { timestamps: true });

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;