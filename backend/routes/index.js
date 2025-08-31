// 1. Fix your routes/index.js - Add missing auth routes
const express = require('express')
const router = express.Router()
const path = require('path');
const fs = require('fs');
const upload = require("../middleware/uploadMiddleware")


// Import controllers
const userSignUpController = require("../controller/userSignup")
const userSignInController = require("../controller/userSignin")
const userDetailsController = require('../controller/userDetails')
const authToken = require('../middleware/authToken')
const userLogout = require('../controller/userLogout')
const allUsers = require('../controller/allUsers')
const updateUser = require('../controller/updateUser')
const AddChannelingAppoiintmentController = require("../controller/addChannelingAppointment")
const getChannelingAppointmentController = require("../controller/getChannelingAppointments")
const AddNoticeController = require("../controller/addNotice")
const getNoticeController = require("../controller/getNotice")
const updateNoticeController = require("../controller/updateNotice")
const updateChannelingAppointmentController = require("../controller/updateChannelingAppointment")
const AddHomeVisitAppoiintmentController = require("../controller/addHomeVisitAppointment")
const getHomeVisitAppointmentController = require("../controller/getHomeVisitAppointment")
const updateHomeVisitAppointmentController = require("../controller/updateHomeVisitAppointment")
const { createItem, getAllItems, getItemById, updateItem, deleteItem } = require('../controller/laboratoryItemController')
const { getAllStock, getStockById, updateStock, deleteStock, createStock } = require('../controller/pharmacyStockController')
const { getAllTest, getTestById, updateTest, deleteTest, createTest } = require('../controller/laboratoryTestController')
const deleteUser = require('../controller/deleteUser')
const { getResources, addResource, updateResourceAvailability, deleteResource } = require('../controller/resourceController')
const deleteChannelingAppointment = require('../controller/deleteChannelingAppointment')
const deleteHomeVisitAppointment = require('../controller/deleteHomeVisitAppointment')
const deleteNotice = require('../controller/deleteNotice')
const { getMarks, addMark, updateMark, deleteMark, getMarksByStudent } = require("../controller/marksController")
const { getCourseMaterials, addCourseMaterial, updateCourseMaterial, deleteCourseMaterial } = require("../controller/courseMaterialController");
const checkIndexNumber = require('../controller/checkIndexNumberController');

// Book controllers
const { getBooks, addBook, updateBook, deleteBook, getBookById } = require('../controller/bookController');
const { createReservation, getUserReservations, getAllReservations, updateReservationStatus, cancelReservation } = require('../controller/bookReservationController');
const changePassword = require('../controller/changePassword');

const checkMembership = require('../middleware/checkMembership');

// Add to your existing imports
const { 
  getEBooks, 
  getEBookById, 
  addEBook, 
  updateEBook, 
  deleteEBook, 
  downloadEBook,
  viewEBook  // Added this since it's used in routes below
} = require('../controller/eBookController');
const ebookUpload = require('../middleware/ebookUpload');

// E-Book routes
router.get("/e-books", getEBooks);
router.get("/e-books/:id", getEBookById);
router.post("/e-books", authToken, ebookUpload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), addEBook);
router.put("/e-books/:id", authToken, ebookUpload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), updateEBook);
router.delete("/e-books/:id", authToken, deleteEBook);

// Update eBook routes to include viewer
router.get("/e-books/view/:id", getEBookById); // Keep existing
router.get("/e-books/view-pdf/:id", viewEBook); // Add PDF viewer route

// Book routes
router.get("/books", getBooks);
router.get("/books/:id", getBookById);
router.post("/books", upload.single("image"), addBook);
router.put("/books/:id", upload.single("image"), updateBook);
router.delete("/books/:id", deleteBook);

// Book Reservation routes
router.post("/book-reservation", authToken, createReservation);
router.get("/user-reservations", authToken, getUserReservations);
router.get("/all-reservations", authToken, getAllReservations);
router.put("/reservation-status/:id", authToken, updateReservationStatus); // This is the correct route
router.put("/cancel-reservation/:id", authToken, cancelReservation);
router.put('/change-password', authToken, changePassword);

// Import new controllers
const { 
  uploadMembershipSlip, 
  approveMembership, 
  getAllPendingMemberships 
} = require('../controller/membershipController');



// Add membership routes
router.post("/upload-membership-slip", 
  authToken, 
  upload.single("slipImage"), 
  (req, res, next) => {
    console.log("=== Membership slip upload route hit ===");
    console.log("User ID from token:", req.userId);
    console.log("File received:", req.file ? req.file.filename : "No file");
    console.log("Body:", req.body);
    next();
  },
  uploadMembershipSlip
);

router.post("/approve-membership", 
  authToken, 
  (req, res, next) => {
    console.log("=== Approve membership route hit ===");
    console.log("Admin ID from token:", req.userId);
    console.log("Request body:", req.body);
    next();
  },
  approveMembership
);

router.get("/pending-memberships", 
  authToken, 
  (req, res, next) => {
    console.log("=== Pending memberships route hit ===");
    console.log("Requester ID:", req.userId);
    next();
  },
  getAllPendingMemberships
);

// User routes
router.post("/signup", userSignUpController)
router.post("/signin", userSignInController)
router.get("/user-details", authToken, userDetailsController)
router.get("/userLogout", userLogout)

// Admin panel routes
router.get("/all-users", allUsers)
router.post("/update-user", authToken, updateUser)
router.delete("/delete-user/:id", deleteUser)
router.get("/check-index-number", checkIndexNumber);

// Resources routes
router.get("/resources", getResources)
router.post("/resources", addResource)
router.patch("/resources/:id", updateResourceAvailability)
router.delete("/resources/:id", deleteResource)

// Channeling appointment routes
router.post("/add-channeling-appointment", AddChannelingAppoiintmentController)
router.get("/get-channeling-appointments", getChannelingAppointmentController)
router.post("/update-channeling-appointment", updateChannelingAppointmentController)
router.post("/delete-channeling-appointment", deleteChannelingAppointment)

// Notice routes
router.post("/add-notice", authToken, AddNoticeController)
router.get("/get-notice", getNoticeController)
router.post("/update-notice", authToken, updateNoticeController)
router.post("/delete-notice", deleteNotice)

// Home visit appointment routes
router.post("/add-homevisit-appointment", AddHomeVisitAppoiintmentController)
router.get("/get-homevisit-appointments", getHomeVisitAppointmentController)
router.post("/update-homevisit-appointment", updateHomeVisitAppointmentController)
router.post("/delete-home-visit-appointment", deleteHomeVisitAppointment)

// Lab items routes
router.post("/add-item", createItem)
router.get("/get-items", getAllItems)
router.get("/get-item/:id", getItemById)
router.post("/edit-item/:id", updateItem)
router.delete("/delete-item/:id", deleteItem)

// Pharmacy stock routes
router.post("/add-stock", createStock)
router.get("/get-stocks", getAllStock)
router.get("/get-stock/:id", getStockById)
router.post("/edit-stock/:id", updateStock)
router.delete("/delete-stock/:id", deleteStock)

// Lab tests routes
router.post("/add-test", createTest)
router.get("/get-tests", getAllTest)
router.get("/get-test/:id", getTestById)
router.post("/edit-test/:id", updateTest)
router.delete("/delete-test/:id", deleteTest)

// Course materials routes
router.get("/get-course-materials", getCourseMaterials)
router.post("/add-course-materials", upload.single("material"), addCourseMaterial)
router.patch("/update-course-materials/:id", upload.single("material"), updateCourseMaterial)
router.delete("/delete-course-materials/:id", deleteCourseMaterial)

// Marks routes
router.get("/get-marks", getMarks)
router.post("/add-marks", addMark)
router.patch("/update-marks/:id", updateMark)
router.delete("/delete-marks/:id", deleteMark)
router.get("/marks/student/:studentNumber", getMarksByStudent)

const {
    getUserById,
    updateMedicalRecord,
    getMedicalRecords
} = require('../controller/patientRecordsController');

// Medical records routes
router.get('/users/:id/medical-records', getMedicalRecords);
router.post('/users/:id/medical-records', updateMedicalRecord);
router.get('/users/:id', getUserById);

// File download route
router.get('/download/:filename', async (req, res) => {
  try {
    // Validate filename
    const filename = req.params.filename;
    if (!filename || filename.includes('..')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename'
      });
    }

    // Construct safe file path
    const uploadsDir = path.join(__dirname, '../uploads');
    const filePath = path.join(uploadsDir, filename);

    // Verify file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Set download headers
    const originalName = req.query.name || filename;
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(originalName)}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    fileStream.on('error', (err) => {
      console.error('File stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error streaming file'
        });
      }
    });

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;