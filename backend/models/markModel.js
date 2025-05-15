const mongoose = require("mongoose");

const markSchema = new mongoose.Schema(
  {
    testName: { type: String, required: true },
    studentNumber: { type: String, required: true },
    studentName: { type: String, required: true },
    marks: { type: Number, required: true },
    year: { type: String, required: true, enum: ["Y1", "Y2", "Y3"] },
    semester: { type: String, required: true, enum: ["S1", "S2"] }
  },
  { timestamps: true }
);

const Mark = mongoose.model("Mark", markSchema);

module.exports = Mark;