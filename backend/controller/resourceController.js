const Resource = require("../models/resourceModel");


async function getResources(req, res) {
  try {
    const resources = await Resource.find();
    res.json({ success: true, data: resources });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}


async function addResource(req, res) {
  try {
    const { name, type, availability } = req.body;
    const newResource = new Resource({ name, type, availability });
    await newResource.save();
    res.json({ success: true, message: "Resource added successfully!" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}


async function updateResourceAvailability(req, res) {
  try {
    const { availability } = req.body;
    const updatedResource = await Resource.findByIdAndUpdate(req.params.id, { availability }, { new: true });
    res.json({ success: true, message: "Availability updated!", data: updatedResource });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}


async function deleteResource(req, res) {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Resource deleted successfully!" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

module.exports = { getResources, addResource, updateResourceAvailability, deleteResource };
