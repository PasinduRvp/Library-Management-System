import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { 
  MdOutlineDelete, 
  MdSearch, 
  MdDownload, 
  MdEdit,
  MdImage 
} from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import SummaryApi from "../common";
const backendDomain = "http://localhost:8000";

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [newBook, setNewBook] = useState({ 
    name: "", 
    isbn: "", 
    author: "", 
    category: "", 
    price: "", 
    count: "" 
  });
  const [editBook, setEditBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const categories = [
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
  ];

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(SummaryApi.getBooks.url, {
        method: SummaryApi.getBooks.method,
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setBooks(data.data);
        setFilteredBooks(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error fetching books");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(book =>
        book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  }, [searchQuery, books]);

  const generateBookReport = () => {
    if (filteredBooks.length === 0) {
      toast.error("No books available to generate report");
      return;
    }

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // Header Section
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(251, 146, 60); // amber-500
      doc.text("BOOKNEST", 105, 25, { align: "center" });

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text("Digital Library Management System", 105, 32, { align: "center" });
      doc.text("Comprehensive Book Inventory Report", 105, 37, { align: "center" });

      doc.setLineWidth(0.5);
      doc.setDrawColor(251, 146, 60); // amber-500
      doc.line(14, 43, 196, 43);

      // Report Title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("BOOK INVENTORY REPORT", 105, 55, { align: "center" });

      // Report Metadata
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      doc.text(`Report Generated: ${currentDate}`, 14, 65);
      doc.text(`Total Books: ${filteredBooks.length}`, 160, 65, { align: "right" });

      // Book Statistics
      const bookCategories = {};
      let totalBooks = 0;
      let totalValue = 0;
      
      filteredBooks.forEach(book => {
        bookCategories[book.category] = (bookCategories[book.category] || 0) + 1;
        totalBooks += book.count;
        totalValue += book.price * book.count;
      });
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Library Summary", 14, 75);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Total Copies: ${totalBooks}`, 14, 85);
      doc.text(`Total Collection Value: Rs. ${totalValue.toFixed(2)}`, 14, 90);
      
      let yPos = 100;
      doc.setFont("helvetica", "bold");
      doc.text("Books by Category:", 14, yPos);
      yPos += 7;
      
      doc.setFont("helvetica", "normal");
      Object.entries(bookCategories).forEach(([category, count]) => {
        doc.text(`${category}: ${count} titles`, 20, yPos);
        yPos += 7;
      });

      // Book Table
      yPos += 10;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Detailed Book Inventory", 14, yPos);
      yPos += 10;

      const tableColumns = ["#", "Book Name", "Author", "Category", "ISBN", "Price", "Copies"];
      const tableRows = filteredBooks.map((book, index) => [
        index + 1,
        book.name,
        book.author,
        book.category,
        book.isbn,
        `Rs. ${book.price}`,
        book.count
      ]);

      autoTable(doc, {
        head: [tableColumns],
        body: tableRows,
        startY: yPos,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { 
          fillColor: [251, 146, 60], // amber-500
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 45 },
          2: { cellWidth: 35 },
          3: { cellWidth: 25 },
          4: { cellWidth: 30 },
          5: { cellWidth: 20, halign: 'right' },
          6: { cellWidth: 15, halign: 'center' }
        },
        alternateRowStyles: { fillColor: [254, 243, 199] }, // amber-100
        margin: { left: 14 }
      });

      // Footer
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(10);
      doc.text("***End of Report***", 105, finalY, { align: "center" });

      // Page number
      doc.setFontSize(9);
      doc.text(`Page 1 of 1`, 180, 280);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 280);

      // Save the PDF
      doc.save(`BookNest_Inventory_Report_${currentDate.replace(/\s+/g, '_')}.pdf`);
      toast.success("Book report downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate report. Please try again.");
    }
  };

  const handleImageChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      if (isEdit) {
        setEditImageFile(file);
      } else {
        setImageFile(file);
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (isEdit) {
          setPreviewImage(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBook = async () => {
    if (!newBook.name || !newBook.isbn || !newBook.author || 
        !newBook.category || !newBook.price || !newBook.count) {
      return toast.error("Please fill in all required fields!");
    }

    try {
      const formData = new FormData();
      formData.append("name", newBook.name);
      formData.append("isbn", newBook.isbn);
      formData.append("author", newBook.author);
      formData.append("category", newBook.category);
      formData.append("price", newBook.price);
      formData.append("count", newBook.count);
      
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch(SummaryApi.addBook.url, {
        method: SummaryApi.addBook.method,
        credentials: "include",
        body: formData,
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success("Book added successfully!");
        fetchBooks();
        setNewBook({ 
          name: "", 
          isbn: "", 
          author: "", 
          category: "", 
          price: "", 
          count: "" 
        });
        setImageFile(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error adding book");
    }
  };

  const handleUpdateBook = async () => {
    if (!editBook.name || !editBook.isbn || !editBook.author || 
        !editBook.category || !editBook.price || !editBook.count) {
      return toast.error("Please fill in all required fields!");
    }

    try {
      const formData = new FormData();
      formData.append("name", editBook.name);
      formData.append("isbn", editBook.isbn);
      formData.append("author", editBook.author);
      formData.append("category", editBook.category);
      formData.append("price", editBook.price);
      formData.append("count", editBook.count);
      
      if (editImageFile) {
        formData.append("image", editImageFile);
      }

      const response = await fetch(SummaryApi.updateBook.url(editBook._id), {
        method: SummaryApi.updateBook.method,
        credentials: "include",
        body: formData,
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success("Book updated successfully!");
        fetchBooks();
        setEditBook(null);
        setEditImageFile(null);
        setPreviewImage("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error updating book");
    }
  };

  const handleDeleteBook = async (id) => {
    toast.info(
      <div className="p-4">
        <p className="text-gray-800 font-medium text-lg mb-3">
          Are you sure you want to delete this book?
        </p>
        <p className="text-gray-600 text-sm mb-4">This action cannot be undone.</p>
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={async () => {
              try {
                const response = await fetch(SummaryApi.deleteBook.url(id), {
                  method: SummaryApi.deleteBook.method,
                  credentials: "include",
                });
                const data = await response.json();
                if (data.success) {
                  toast.success("Book deleted successfully!");
                  fetchBooks();
                } else {
                  toast.error(data.message);
                }
              } catch (error) {
                toast.error("Error deleting book");
              }
              toast.dismiss();
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl transition-colors shadow-md hover:shadow-lg"
          >
            Delete
          </button>
          <button
            onClick={() => {
              toast.dismiss();
              toast.info("Deletion canceled");
            }}
            className="bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-xl transition-colors shadow-md hover:shadow-lg"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        className: "shadow-xl rounded-xl"
      }
    );
  };

  const openEditModal = (book) => {
    setEditBook({...book});
    setPreviewImage(book.image ? `${backendDomain}${book.image}` : "");
    setEditImageFile(null);
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-3xl min-h-screen">
      <div className="bg-white py-5 px-6 flex flex-col md:flex-row justify-between items-center rounded-3xl shadow-lg">
        <h2 className="font-bold text-2xl text-gray-800 mb-4 md:mb-0">
          Book Management
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdSearch className="text-gray-400 text-xl" />
            </div>
            <input
              type="text"
              placeholder="Search books by title, author, ISBN or category..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <motion.button
            onClick={generateBookReport}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
            disabled={isLoading || filteredBooks.length === 0}
          >
            <MdDownload className="text-white text-xl" />
            <span className="hidden sm:inline">Generate Report</span>
          </motion.button>
        </div>
      </div>

      <div className="mt-6 bg-white p-5 rounded-3xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Book</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Book Title *</label>
            <input
              type="text"
              placeholder="Enter book title"
              className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
              value={newBook.name}
              onChange={(e) => setNewBook({ ...newBook, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ISBN *</label>
            <input
              type="text"
              placeholder="Enter ISBN number"
              className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
              value={newBook.isbn}
              onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
            <input
              type="text"
              placeholder="Enter author name"
              className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              className="w-full border p-3 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
              value={newBook.category}
              onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
            >
              <option value="" disabled>Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.) *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter price"
              className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
              value={newBook.price}
              onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Copies *</label>
            <input
              type="number"
              min="0"
              placeholder="Enter count"
              className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
              value={newBook.count}
              onChange={(e) => setNewBook({ ...newBook, count: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Book Cover Image</label>
            <div className="flex items-center gap-3">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <MdImage className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500">Click to upload image</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, false)}
                />
              </label>
              {imageFile && (
                <div className="text-sm text-green-600">
                  {imageFile.name} selected
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-end">
            <motion.button
              className="w-full bg-amber-600 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-amber-700 transition-all shadow-md hover:shadow-lg"
              onClick={handleAddBook}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!newBook.name || !newBook.isbn || !newBook.author || 
                       !newBook.category || !newBook.price || !newBook.count || isLoading}
            >
              <IoMdAdd className="text-white text-xl" /> 
              <span>Add Book</span>
            </motion.button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-8 bg-white rounded-3xl shadow-lg p-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : (
        <div className="mt-8 bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-amber-600">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    #
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Cover
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Author
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    ISBN
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Copies
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book, index) => (
                    <tr key={book._id || index} className="hover:bg-amber-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {book.image ? (
                          <img 
                            src={`${backendDomain}${book.image}`} 
                            alt={book.name}
                            className="h-12 w-9 object-cover rounded shadow-sm"
                          />
                        ) : (
                          <div className="h-12 w-9 bg-amber-100 flex items-center justify-center rounded shadow-sm">
                            <MdImage className="text-amber-400 text-xl" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {book.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {book.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {book.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {book.isbn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        Rs. {book.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          book.count > 0 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {book.availableCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-amber-600 hover:text-amber-800 p-2 rounded-full hover:bg-amber-100 transition-colors"
                            onClick={() => openEditModal(book)}
                            title="Edit Book"
                          >
                            <MdEdit className="text-xl" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition-colors"
                            onClick={() => handleDeleteBook(book._id)}
                            title="Delete Book"
                          >
                            <MdOutlineDelete className="text-xl" />
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchQuery ? "No books match your search." : "No books available in the library."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {editBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Edit Book</h3>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Book Title *</label>
                <input
                  type="text"
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  value={editBook.name}
                  onChange={(e) => setEditBook({ ...editBook, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ISBN *</label>
                <input
                  type="text"
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  value={editBook.isbn}
                  onChange={(e) => setEditBook({ ...editBook, isbn: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
                <input
                  type="text"
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  value={editBook.author}
                  onChange={(e) => setEditBook({ ...editBook, author: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  className="w-full border p-3 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  value={editBook.category}
                  onChange={(e) => setEditBook({ ...editBook, category: e.target.value })}
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  value={editBook.price}
                  onChange={(e) => setEditBook({ ...editBook, price: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Copies *</label>
                <input
                  type="number"
                  min="0"
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  value={editBook.count}
                  onChange={(e) => setEditBook({ ...editBook, count: e.target.value })}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Book Cover Image</label>
                <div className="flex flex-col md:flex-row items-start gap-4">
                  {previewImage && (
                    <div className="w-32 h-48 border rounded-xl overflow-hidden">
                      <img 
                        src={previewImage} 
                        alt="Book preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <MdImage className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500">Click to change image</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, true)}
                    />
                  </label>
                  
                  {editImageFile && (
                    <div className="text-sm text-green-600 mt-2 md:mt-0">
                      {editImageFile.name} selected
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={() => {
                  setEditBook(null);
                  setEditImageFile(null);
                  setPreviewImage("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateBook}
                className="px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors shadow-md hover:shadow-lg"
                disabled={!editBook.name || !editBook.isbn || !editBook.author || 
                         !editBook.category || !editBook.price || !editBook.count}
              >
                Update Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookManagement;