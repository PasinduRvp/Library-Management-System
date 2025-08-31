const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    category: { 
      type: String, 
      enum: [
       "All",
    "Fiction", 
    "Non-Fiction", 
    "Education & Reference", 
    "Science & Technology", 
    "Arts & Literature", 
    "Children's", 
    "Young Adult", 
    "Religion & Spirituality",
    "Lifestyle & Hobbies",
    "Magazines & Periodicals"

      ], 
      required: true 
    },
    price: { type: Number, required: true, min: 0 },
    count: { type: Number, required: true, min: 0, default: 0 },
    availableCount: { type: Number, required: true, min: 0, default: 0 },
    image: { type: String, default: "" }
  },
  { timestamps: true }
);

// Update availableCount when count changes
bookSchema.pre('save', function(next) {
  if (this.isModified('count')) {
    this.availableCount = this.count;
  }
  next();
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;