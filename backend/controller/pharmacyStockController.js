const PharmacyItemModel = require("../models/pharmacyItemModel");

async function createStock(req, res) {
    try {
        const itemCount = await PharmacyItemModel.countDocuments();
        const newItem = new PharmacyItemModel({
            stockId: `PHARM-${itemCount + 1}`,
            stockName: req.body.stockName,
            stockType: req.body.stockType,
            stockCount: req.body.stockCount,
            exDate: req.body.exDate,
            mfDate: req.body.mfDate,
            company: req.body.company,
            dealerName: req.body.dealerName,
            contact: req.body.contact
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

async function getAllStock(req, res) {
    try {
        const stockItems = await PharmacyItemModel.find();
        res.json({
            message: "All stock items",
            data: stockItems,
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

const getStockById = async (req, res) => {
    try {
        const stockItem = await PharmacyItemModel.findById(req.params.id);
        if (!stockItem) {
            return res.status(404).json({ message: "Stock item not found" });
        }
        res.status(200).json(stockItem);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve stock item" });
    }
};

const updateStock = async (req, res) => {
    try {
        const updatedStockItem = await PharmacyItemModel.findByIdAndUpdate(
            req.body._id, 
            {
                stockName: req.body.stockName,
                stockType: req.body.stockType,
                stockCount: req.body.stockCount,
                exDate: req.body.exDate,
                mfDate: req.body.mfDate,
                company: req.body.company,
                dealerName: req.body.dealerName,
                contact: req.body.contact
            }, 
            { new: true }
        );
        
        if (!updatedStockItem) {
            return res.status(404).json({ message: "Stock item not found" });
        }
        res.status(200).json(updatedStockItem);
    } catch (error) {
        res.status(500).json({ message: "Failed to update stock item" });
    }
};

const deleteStock = async (req, res) => {
    try {
        const deletedStockItem = await PharmacyItemModel.findByIdAndDelete(req.params.id);
        if (!deletedStockItem) {
            return res.status(404).json({ message: "Stock item not found" });
        }
        res.status(200).json({ message: "Stock item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete stock item" });
    }
};

module.exports = {
    createStock,
    getAllStock,
    getStockById,
    updateStock,
    deleteStock
};