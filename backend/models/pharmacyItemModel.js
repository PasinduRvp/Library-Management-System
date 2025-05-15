const mongoose = require('mongoose');

const pharmacyItemSchema = new mongoose.Schema(
  {
    stockId: {
      type: String,
      required: true,
      unique: true
    },
    stockName: {
      type: String,
      required: true,
    },
    stockType: {
      type: String,
      required: true,
      enum: ['tablet', 'bottle', 'boxes' , 'other'],
      default: 'tablet'
    },
    stockCount: {
      type: Number,
      required: true,
      min: 0
    },
    exDate: {
      type: Date,
      required: true,
    },
    mfDate: {
      type: Date,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    dealerName: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^\d{10,15}$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    }
  },
  { timestamps: true }
);

const PharmacyItemModel = mongoose.model('PharmacyItem', pharmacyItemSchema);

module.exports = PharmacyItemModel;