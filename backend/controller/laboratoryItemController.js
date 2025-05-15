const laboratoryItemModel = require("../models/laboratoryItemModel");

// Create Item with auto-generated ID
async function createItem(req, res) {
    try {
        // Get the count of existing items to generate the next ID
        const itemCount = await laboratoryItemModel.countDocuments();
        const newItem = new laboratoryItemModel({
            itemId: `ITEM-${itemCount + 1}`,
            itemName: req.body.itemName,
            itemCount: req.body.itemCount
        });
        
        await newItem.save();
        res.status(201).json({ 
            data: newItem, 
            success: true, 
            message: "Item added successfully" 
        });
    } catch (err) {
        res.status(400).json({ 
            message: err.message || err, 
            error: true, 
            success: false 
        });
    }
}

// Get all items
async function getAllItems(req, res) {
    try {
        const getAllItems = await laboratoryItemModel.find();
        res.json({
            message: "All Items",
            data: getAllItems,
            success: true,
            error: false
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

// Get single item by ID
const getItemById = async (req, res) => {
    try {
        const item = await laboratoryItemModel.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve item" });
    }
};

// Update an existing laboratory item
const updateItem = async (req, res) => {
    try {
        const updatedItem = await laboratoryItemModel.findByIdAndUpdate(
            req.body._id, 
            {
                itemName: req.body.itemName,
                itemCount: req.body.itemCount
            }, 
            { new: true }
        );
        
        if (!updatedItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: "Failed to update item" });
    }
};

// Delete an item
const deleteItem = async (req, res) => {
    try {
        const deletedItem = await laboratoryItemModel.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete item" });
    }
};

module.exports = {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem,
};