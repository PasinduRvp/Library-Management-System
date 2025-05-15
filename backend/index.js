const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db')
const router = require('./routes');
const path = require('path');
const app = express()
const fs = require('fs');



app.use(cors({
    origin : process.env.FONTEND_URL,
    credentials : true
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api",router)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const laboratoryItemRoutes = require("./routes/index");
app.use("/api", laboratoryItemRoutes);

// Configure static file serving
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }

  // Add proper headers for file downloads
app.use('/uploads', (req, res, next) => {
    res.setHeader('Content-Disposition', 'attachment');
    next();
  });

  app.use('/api/download', express.static(path.join(__dirname, 'uploads')), (req, res, next) => {
    // Set headers to force download
    res.setHeader('Content-Disposition', 'attachment');
    next();
  });

  // Make sure this is before your other routes
app.get('/api/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    
    if (fs.existsSync(filePath)) {
      res.download(filePath, req.query.name || path.basename(filePath), (err) => {
        if (err) {
          console.error('Download error:', err);
          res.status(500).json({ success: false, message: 'Error downloading file' });
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'File not found' });
    }
  });

  app.use('/download', express.static(path.join(__dirname, 'uploads')), (req, res, next) => {
    // Set headers to force download
    res.setHeader('Content-Disposition', 'attachment')
    next()
  })

// Make sure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const PORT = process.env.PORT || 8080;



connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("connect to DB")
        console.log("Server is runnig")
    })

})


