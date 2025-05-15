const mongoose = require("mongoose");

const courseMaterialSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },
    subtopic: { type: String, required: true },
    material: { type: String, required: true }, // Path to the stored file
    originalFileName: { type: String, required: true } // Original uploaded filename
  },
  { timestamps: true }
);

const CourseMaterial = mongoose.model("CourseMaterial", courseMaterialSchema);

module.exports = CourseMaterial;