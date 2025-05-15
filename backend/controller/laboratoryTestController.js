const LaboratoryTest = require("../models/laboratoryTestModel");
const mongoose = require('mongoose');
const schedule = require('node-schedule');

// Schedule automatic deletion of tests older than 6 months
const scheduleTestDeletion = () => {
  // Run every day at midnight
  const job = schedule.scheduleJob('0 0 * * *', async () => {
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const result = await LaboratoryTest.deleteMany({
        testDate: { $lte: sixMonthsAgo }
      });
      
      console.log(`Deleted ${result.deletedCount} tests older than 6 months`);
    } catch (error) {
      console.error('Error in scheduled test deletion:', error);
    }
  });
};

// Call this function when your server starts
scheduleTestDeletion();

const createTest = async (req, res) => {
  const { name, ageYears, ageMonths, address, mobile, gender, testDate, testData } = req.body;

  try {
    const newTest = new LaboratoryTest({
      name,
      ageYears,
      ageMonths,
      address,
      mobile,
      gender,
      testDate: testDate || new Date(),
      testData,
    });
    await newTest.save();
    res.status(201).json({ success: true, data: newTest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error creating laboratory test' });
  }
};

const getAllTest = async (req, res) => {
  try {
    // Only get tests from the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const tests = await LaboratoryTest.find({
      testDate: { $gte: sixMonthsAgo }
    }).sort({ testDate: -1 });
    
    res.status(200).json({ success: true, data: tests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching laboratory tests' });
  }
};

const getTestById = async (req, res) => {
  try {
    const test = await LaboratoryTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }
    res.status(200).json({ success: true, data: test });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching laboratory test' });
  }
};

const updateTest = async (req, res) => {
  try {
    const updatedTest = await LaboratoryTest.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedTest) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }
    res.status(200).json({ success: true, data: updatedTest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating laboratory test' });
  }
};

const deleteTest = async (req, res) => {
  try {
    const deletedTest = await LaboratoryTest.findByIdAndDelete(req.params.id);
    if (!deletedTest) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }
    res.status(200).json({ success: true, message: 'Test deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error deleting laboratory test' });
  }
};

module.exports = {
  createTest,
  getAllTest,
  getTestById,
  updateTest,
  deleteTest,
};