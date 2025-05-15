const Mark = require("../models/markModel");

async function getMarks(req, res) {
  try {
    const marks = await Mark.find();
    res.json({ success: true, data: marks });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function addMark(req, res) {
  try {
    const { testName, studentNumber, studentName, marks, year, semester } = req.body;
    const newMark = new Mark({ 
      testName, 
      studentNumber, 
      studentName, 
      marks,
      year,
      semester
    });
    await newMark.save();
    res.json({ success: true, message: "Mark allocated successfully!" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function updateMark(req, res) {
  try {
    const { testName, studentNumber, studentName, marks, year, semester } = req.body;
    const updatedMark = await Mark.findByIdAndUpdate(
      req.params.id, 
      { testName, studentNumber, studentName, marks, year, semester }, 
      { new: true }
    );
    res.json({ success: true, message: "Mark updated successfully!", data: updatedMark });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function deleteMark(req, res) {
  try {
    await Mark.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Mark deleted successfully!" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function getMarksByStudent(req, res) {
  try {
    const { studentNumber } = req.params;
    const marks = await Mark.find({ studentNumber });
    res.json({ success: true, data: marks });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

module.exports = { getMarks, addMark, updateMark, deleteMark, getMarksByStudent };