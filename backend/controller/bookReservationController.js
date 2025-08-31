// controller/bookReservationController.js - Updated
const BookReservation = require("../models/bookReservationModel");
const Book = require("../models/bookModel");
const User = require("../models/userModel");

async function createReservation(req, res) {
  try {
    const { bookId, pickupDate, userPhone } = req.body;
    const userId = req.userId;

    // Check user membership status
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.membershipStatus !== "ACTIVE") {
      return res.status(400).json({ 
        success: false, 
        message: "Your membership is not active. Please complete membership payment." 
      });
    }

    // Check user's current reservations
    const currentReservations = await BookReservation.countDocuments({
      userId,
      status: { $in: ["PENDING", "APPROVED"] }
    });

    if (currentReservations >= user.reservationLimit) {
      return res.status(400).json({ 
        success: false, 
        message: `You can only reserve ${user.reservationLimit} books at a time` 
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    if (book.availableCount <= 0) {
      return res.status(400).json({ success: false, message: "Book is not available for reservation" });
    }

    // Calculate return date (2 weeks from pickup)
    const pickup = new Date(pickupDate);
    const returnDate = new Date(pickup);
    returnDate.setDate(returnDate.getDate() + 14);

    const newReservation = new BookReservation({
      bookId,
      userId,
      userName: user.name,
      userEmail: user.email,
      userPhone,
      pickupDate: pickup,
      expectedReturnDate: returnDate
    });

    await newReservation.save();
    await newReservation.populate('bookId', 'name author image');

    res.json({ 
      success: true, 
      message: "Reservation request submitted successfully!", 
      data: newReservation 
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function getUserReservations(req, res) {
  try {
    const userId = req.userId;
    
    const reservations = await BookReservation.find({ userId })
      .populate('bookId', 'name author image category')
      .sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      data: reservations 
    });
  } catch (err) {
    console.error("Error fetching user reservations:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching reservations" 
    });
  }
}

async function getAllReservations(req, res) {
  try {
    const reservations = await BookReservation.find({})
      .populate('bookId', 'name author image category')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      data: reservations 
    });
  } catch (err) {
    console.error("Error fetching all reservations:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching reservations" 
    });
  }
}

async function cancelReservation(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const reservation = await BookReservation.findOne({ 
      _id: id, 
      userId: userId 
    }).populate('bookId');

    if (!reservation) {
      return res.status(404).json({ 
        success: false, 
        message: "Reservation not found" 
      });
    }

    if (reservation.status !== "PENDING") {
      return res.status(400).json({ 
        success: false, 
        message: "Only pending reservations can be cancelled" 
      });
    }

    reservation.status = "CANCELLED";
    await reservation.save();

    res.json({ 
      success: true, 
      message: "Reservation cancelled successfully",
      data: reservation 
    });
  } catch (err) {
    console.error("Error cancelling reservation:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error cancelling reservation" 
    });
  }
}



async function updateReservationStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, adminNotes, actualReturnDate } = req.body;

    const reservation = await BookReservation.findById(id).populate('bookId');
    
    if (!reservation) {
      return res.status(404).json({ success: false, message: "Reservation not found" });
    }

    // Handle return date and fine calculation
    if (actualReturnDate) {
      reservation.actualReturnDate = new Date(actualReturnDate);
      const fine = reservation.calculateFine();
      
      if (fine > 0) {
        // Update user's fine amount
        await User.findByIdAndUpdate(
          reservation.userId,
          { $inc: { fines: fine } }
        );
      }
    }

    if (status === "APPROVED" && reservation.status !== "APPROVED") {
      if (reservation.bookId.availableCount <= 0) {
        return res.status(400).json({ success: false, message: "No available copies left" });
      }
      
      await Book.findByIdAndUpdate(
        reservation.bookId._id,
        { $inc: { availableCount: -1 } }
      );
    }

    if ((status === "DECLINED" || status === "CANCELLED") && reservation.status === "APPROVED") {
      await Book.findByIdAndUpdate(
        reservation.bookId._id,
        { $inc: { availableCount: 1 } }
      );
    }

    if (status === "COMPLETED" && reservation.status === "APPROVED") {
      await Book.findByIdAndUpdate(
        reservation.bookId._id,
        { $inc: { availableCount: 1 } }
      );
    }

    reservation.status = status;
    if (adminNotes) {
      reservation.adminNotes = adminNotes;
    }

    await reservation.save();

    res.json({ 
      success: true, 
      message: `Reservation ${status.toLowerCase()} successfully!`,
      data: reservation 
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

// Add function to check for overdue reservations
async function checkOverdueReservations() {
  try {
    const overdueReservations = await BookReservation.find({
      status: "APPROVED",
      expectedReturnDate: { $lt: new Date() },
      actualReturnDate: { $exists: false }
    });

    for (const reservation of overdueReservations) {
      const daysOverdue = Math.ceil((new Date() - reservation.expectedReturnDate) / (1000 * 60 * 60 * 24));
      const fineAmount = daysOverdue * 1;
      
      await BookReservation.findByIdAndUpdate(
        reservation._id,
        { 
          status: "OVERDUE",
          fineAmount 
        }
      );

      // Update user's fine amount
      await User.findByIdAndUpdate(
        reservation.userId,
        { $inc: { fines: fineAmount } }
      );
    }
  } catch (error) {
    console.error("Error checking overdue reservations:", error);
  }
}

// Run this function daily (you can set up a cron job)
setInterval(checkOverdueReservations, 24 * 60 * 60 * 1000); // Run daily

module.exports = {
  createReservation,
  getUserReservations,
  getAllReservations,
  updateReservationStatus,
  cancelReservation,
  checkOverdueReservations
};