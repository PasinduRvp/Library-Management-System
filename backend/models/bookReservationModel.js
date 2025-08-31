// models/bookReservationModel.js - Updated
const mongoose = require("mongoose");

const bookReservationSchema = new mongoose.Schema(
  {
    bookId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Book', 
      required: true 
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userPhone: { type: String, required: true },
    reservationDate: { type: Date, default: Date.now },
    pickupDate: { type: Date, required: true },
    expectedReturnDate: { type: Date},
    actualReturnDate: { type: Date },
    status: { 
      type: String, 
      enum: ["PENDING", "APPROVED", "DECLINED", "COMPLETED", "CANCELLED", "OVERDUE"], 
      default: "PENDING" 
    },
    adminNotes: { type: String, default: "" },
    fineAmount: { type: Number, default: 0 },
    finePaid: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Calculate fine if book is returned late
bookReservationSchema.methods.calculateFine = function() {
  if (this.actualReturnDate && this.actualReturnDate > this.expectedReturnDate) {
    const daysLate = Math.ceil((this.actualReturnDate - this.expectedReturnDate) / (1000 * 60 * 60 * 24));
    this.fineAmount = daysLate * 1; // Rs. 1 per day
    this.status = "OVERDUE";
    return this.fineAmount;
  }
  return 0;
};

const BookReservation = mongoose.model("BookReservation", bookReservationSchema);

module.exports = BookReservation;