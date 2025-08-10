const EBook = require("../models/eBookModel");
const fs = require("fs");
const path = require("path");


// Get all e-books
async function getEBooks(req, res) {
  try {
    const { category, search } = req.query;
    let filter = {};
    
    if (category && category !== 'All') {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } }
      ];
    }

    const ebooks = await EBook.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: ebooks });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

// Get single e-book
async function getEBookById(req, res) {
  try {
    const ebook = await EBook.findById(req.params.id);
    if (!ebook) {
      return res.status(404).json({ success: false, message: "E-Book not found" });
    }
    res.json({ success: true, data: ebook });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

// Add new e-book
async function addEBook(req, res) {
  try {
    const { name, author, isbn, category, pageCount, description } = req.body;
    
    // Check if ISBN already exists
    const existingEBook = await EBook.findOne({ isbn });
    if (existingEBook) {
      return res.status(400).json({ 
        success: false, 
        message: "E-Book with this ISBN already exists" 
      });
    }
    
    const image = req.files['image'] ? `/uploads/ebooks/${req.files['image'][0].filename}` : "";
    const pdf = req.files['pdf'] ? `/uploads/ebooks/${req.files['pdf'][0].filename}` : "";
    
    const newEBook = new EBook({ 
      name, 
      author, 
      isbn, 
      category, 
      pageCount: parseInt(pageCount),
      description,
      image,
      pdf
    });
    
    await newEBook.save();
    res.json({ success: true, message: "E-Book added successfully!" });
  } catch (err) {
    // Remove uploaded files if error occurs
    if (req.files) {
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          fs.unlinkSync(file.path);
        });
      });
    }
    res.status(400).json({ success: false, message: err.message });
  }
}

// Update e-book
async function updateEBook(req, res) {
  try {
    const { name, author, isbn, category, pageCount, description } = req.body;
    const ebookId = req.params.id;
    
    // Check if ISBN already exists for another book
    const existingEBook = await EBook.findOne({ isbn, _id: { $ne: ebookId } });
    if (existingEBook) {
      return res.status(400).json({ 
        success: false, 
        message: "Another e-book with this ISBN already exists" 
      });
    }
    
    const updateData = { name, author, isbn, category, pageCount: parseInt(pageCount), description };
    
    // Handle file updates
    if (req.files) {
      const currentEBook = await EBook.findById(ebookId);
      
      if (req.files['image']) {
        if (currentEBook.image) {
          const oldImagePath = path.join(__dirname, '..', currentEBook.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        updateData.image = `/uploads/ebooks/${req.files['image'][0].filename}`;
      }
      
      if (req.files['pdf']) {
        if (currentEBook.pdf) {
          const oldPdfPath = path.join(__dirname, '..', currentEBook.pdf);
          if (fs.existsSync(oldPdfPath)) {
            fs.unlinkSync(oldPdfPath);
          }
        }
        updateData.pdf = `/uploads/ebooks/${req.files['pdf'][0].filename}`;
      }
    }
    
    const updatedEBook = await EBook.findByIdAndUpdate(
      ebookId, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    res.json({ 
      success: true, 
      message: "E-Book updated successfully!", 
      data: updatedEBook 
    });
  } catch (err) {
    if (req.files) {
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          fs.unlinkSync(file.path);
        });
      });
    }
    res.status(400).json({ success: false, message: err.message });
  }
}

// Delete e-book
async function deleteEBook(req, res) {
  try {
    const ebookId = req.params.id;
    const ebook = await EBook.findById(ebookId);
    
    if (!ebook) {
      return res.status(404).json({ success: false, message: "E-Book not found" });
    }
    
    // Delete associated files
    if (ebook.image) {
      const imagePath = path.join(__dirname, '..', ebook.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    if (ebook.pdf) {
      const pdfPath = path.join(__dirname, '..', ebook.pdf);
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    }
    
    await EBook.findByIdAndDelete(ebookId);
    res.json({ success: true, message: "E-Book deleted successfully!" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

// View eBook
async function viewEBook(req, res) {
  try {
    const ebook = await EBook.findById(req.params.id);
    
    if (!ebook) {
      return res.status(404).json({ success: false, message: "E-Book not found" });
    }

    const filePath = path.join(__dirname, '..', ebook.pdf);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    // Set headers for inline viewing (not download)
    res.setHeader('Content-Disposition', `inline; filename="${ebook.name}.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');
    
    // Stream the file for viewing
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

module.exports = {
  getEBooks,
  getEBookById,
  addEBook,
  updateEBook,
  deleteEBook,
  //ownloadEBook,
  viewEBook // Add the new function
};