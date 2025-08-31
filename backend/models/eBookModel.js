const mongoose = require("mongoose");

const eBookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    category: { 
      type: String, 
      enum: [
        "Fiction", 
        "Non-Fiction", 
        "Science", 
        "Technology", 
        "Medicine", 
        "History", 
        "Biography",
        "Self-Help",
        "Business",
        "Education"
      ], 
      required: true 
    },
    pageCount: { type: Number, required: true, min: 1 },
    description: { type: String, default: "" },
    image: { type: String, required: true },
    pdf: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
    downloads: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const EBook = mongoose.model("EBook", eBookSchema);

module.exports = EBook;