import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdSearch, MdDownload } from "react-icons/md";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import SummaryApi from "../common";

const backendDomain = "http://localhost:8000";

const BookCollection = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

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
    let filtered = books;
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(book =>
        book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }
    
    setFilteredBooks(filtered);
  }, [searchQuery, books, selectedCategory]);

  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Library Collection
            </h1>
            <p className="text-gray-600">
              Browse our extensive collection of books and resources
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdSearch className="text-gray-400 text-xl" />
              </div>
              <input
                type="text"
                placeholder="Search by title, author, ISBN or category..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div>
              <select
                className="w-full border p-3 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <p className="text-gray-600">
              Showing {filteredBooks.length} of {books.length} books
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
            </p>
          </div>
        </div>

        {/* Books Grid */}
        {isLoading ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book, index) => (
              <motion.div 
                key={book._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                {/* Book Cover - Proper aspect ratio for books */}
                <div className="relative pt-[80%] overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100">
                  {book.image ? (
                    <img 
                      src={`${backendDomain}${book.image}`} 
                      alt={book.name}
                      className="absolute top-0 left-0 w-full h-full object-contain p-4 transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-4">
                      <div className="text-center">
                        <div className="text-4xl text-amber-400 mb-2">📚</div>
                        <p className="text-amber-600 font-medium text-sm line-clamp-2">{book.name}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Book Details */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-2" title={book.name}>
                    {book.name}
                  </h3>
                  
                  <div className="mb-3">
                    <p className="text-gray-600 text-sm">by <span className="font-medium">{book.author}</span></p>
                  </div>
                  
                  <div className="flex justify-between items-center mb-3 mt-auto">
                    <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {book.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      book.count > 0 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {book.count > 0 ? `${book.availableCount} available` : 'Out of stock'}
                    </span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <p className="text-gray-500 text-xs">ISBN: {book.isbn}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No books found</h3>
            <p className="text-gray-500">
              {searchQuery || selectedCategory !== "All" 
                ? "Try adjusting your search or filter criteria" 
                : "The library collection is currently empty"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCollection;