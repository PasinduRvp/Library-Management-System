const Book = require("../models/bookModel");
const fs = require("fs");
const path = require("path");

async function getBooks(req, res) {
  try {
    console.log("Fetching all books from database...");
    const books = await Book.find();
    console.log("Found books:", books.length);
    res.json({ success: true, data: books });
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(400).json({ success: false, message: err.message });
  }
}

async function addBook(req, res) {
  try {
    const { name, isbn, author, category, price, count } = req.body;
    
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ 
        success: false, 
        message: "Book with this ISBN already exists" 
      });
    }
    
    const image = req.file ? `/uploads/${req.file.filename}` : "";
    
    const newBook = new Book({ 
      name, 
      isbn, 
      author, 
      category, 
      price, 
      count,
      availableCount: count,
      image 
    });
    
    await newBook.save();
    res.json({ success: true, message: "Book added successfully!" });
  } catch (err) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ success: false, message: err.message });
  }
}

async function updateBook(req, res) {
  try {
    const { name, isbn, author, category, price, count } = req.body;
    const bookId = req.params.id;
    
    const existingBook = await Book.findOne({ isbn, _id: { $ne: bookId } });
    if (existingBook) {
      return res.status(400).json({ 
        success: false, 
        message: "Another book with this ISBN already exists" 
      });
    }
    
    const updateData = { name, isbn, author, category, price, count };
    
    const currentBook = await Book.findById(bookId);
    if (count !== undefined && count !== currentBook.count) {
      const countDifference = count - currentBook.count;
      updateData.availableCount = Math.max(0, currentBook.availableCount + countDifference);
    }
    
    if (req.file) {
      if (currentBook.image) {
        const oldImagePath = path.join(__dirname, '..', currentBook.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = `/uploads/${req.file.filename}`;
    }
    
    const updatedBook = await Book.findByIdAndUpdate(
      bookId, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    res.json({ 
      success: true, 
      message: "Book updated successfully!", 
      data: updatedBook 
    });
  } catch (err) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ success: false, message: err.message });
  }
}

async function deleteBook(req, res) {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    
    if (book && book.image) {
      const imagePath = path.join(__dirname, '..', book.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Book.findByIdAndDelete(bookId);
    res.json({ success: true, message: "Book deleted successfully!" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function getBookById(req, res) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }
    res.json({ success: true, data: book });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

module.exports = { 
  getBooks, 
  addBook, 
  updateBook, 
  deleteBook, 
  getBookById 
};