const mongoose = require('mongoose');

const laboratoryItemSchema = new mongoose.Schema(
    {
        itemId: {
            type: String,
            required: true,
            unique: true
        },
        itemName: {
            type: String,
            required: true,
        },
        itemCount: {
            type: Number,
            required: true,
            min: 1
        },
    },
    { timestamps: true }
);

const laboratoryItemModel = mongoose.model('LaboratoryItem', laboratoryItemSchema);

module.exports = laboratoryItemModel;