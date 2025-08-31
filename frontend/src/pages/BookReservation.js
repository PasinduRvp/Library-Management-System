import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { MdSearch } from "react-icons/md";
import { motion } from "framer-motion";
import SummaryApi from "../common";

const BookReservation = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [booksLoading, setBooksLoading] = useState(true);
  const [booksError, setBooksError] = useState(null);

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

  useEffect(() => {
    fetchAvailableBooks();
    fetchUserInfo();
  }, []);

  const fetchAvailableBooks = async () => {
    try {
      setBooksLoading(true);
      setBooksError(null);
      
      console.log("Fetching books from:", SummaryApi.getBooks.url);
      
      const response = await fetch(SummaryApi.getBooks.url, {
        method: SummaryApi.getBooks.method,
        credentials: "include",
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API response:", data);
      
      if (data.success && data.data) {
        console.log("Raw books data:", data.data);
        
        const availableBooks = data.data.filter(book => {
          // Handle both availableCount and count fields
          const available = book.availableCount !== undefined ? book.availableCount : (book.count || 0);
          console.log(`Book: ${book.name}, Available: ${available}`);
          return available > 0;
        });
        
        console.log("Available books after filtering:", availableBooks);
        setBooks(availableBooks);
      } else {
        const errorMsg = data.message || "Failed to fetch books";
        setBooksError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      const errorMsg = "Error fetching books. Please try again.";
      setBooksError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setBooksLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setUserInfo(data.data);
      }
    } catch (error) {
      console.error("Error fetching user info");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedBook || !pickupDate || !userPhone) {
      return toast.error("Please fill all fields");
    }

    if (new Date(pickupDate) >= new Date(returnDate)) {
      return toast.error("Return date must be after pickup date");
    }

    setIsLoading(true);
    try {
      const response = await fetch(SummaryApi.createReservation.url, {
        method: SummaryApi.createReservation.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: selectedBook,
          pickupDate,
          returnDate,
          userPhone
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Reservation request submitted successfully!");
        setSelectedBook("");
        setPickupDate("");
        setReturnDate("");
        setUserPhone("");
        fetchAvailableBooks();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error creating reservation");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateReturnDate = (pickupDate) => {
  if (!pickupDate) return "";
  const date = new Date(pickupDate);
  date.setDate(date.getDate() + 14); // Add 2 weeks
  return date.toISOString().split('T')[0];
};

  // Filter books based on search and category
  const filteredBooks = books.filter(book => {
    if (!book || typeof book !== 'object') return false;
    
    const matchesSearch = 
      (book.name && book.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (book.author && book.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (book.isbn && book.isbn.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  console.log("Books state:", books);
  console.log("Filtered books:", filteredBooks);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Book Reservation</h1>
            <p className="text-gray-600">Select a book from our collection and reserve it for pickup</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Book Selection Panel */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Available Books</h2>
              <motion.button 
                onClick={fetchAvailableBooks}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 bg-amber-100 text-amber-700 rounded-xl text-sm hover:bg-amber-200 transition-colors shadow-md hover:shadow-lg"
              >
                Refresh
              </motion.button>
            </div>
            
            {/* Search and Filter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdSearch className="text-gray-400 text-xl" />
                </div>
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Debug Info */}
            <div className="mb-4 p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs">
              <p className="text-amber-800">Total books: {books.length}</p>
              <p className="text-amber-800">Filtered books: {filteredBooks.length}</p>
              <p className="text-amber-800">Loading: {booksLoading ? 'Yes' : 'No'}</p>
              <p className="text-amber-800">Error: {booksError || 'None'}</p>
            </div>

            {/* Books Grid */}
            {booksLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading available books...</p>
              </div>
            ) : booksError ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">❌</div>
                <p className="text-red-500 mb-4">{booksError}</p>
                <motion.button
                  onClick={fetchAvailableBooks}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Try Again
                </motion.button>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📚</div>
                <p className="text-gray-500">
                  {searchQuery || selectedCategory !== "All" 
                    ? "No available books match your criteria" 
                    : "No books available for reservation at the moment"}
                </p>
                {books.length > 0 && (
                  <p className="text-sm text-gray-400 mt-2">
                    {books.length} books in database, but none available after filtering
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-1">
                {filteredBooks.map((book) => (
                  <motion.div
                    key={book._id || Math.random()}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${
                      selectedBook === book._id 
                        ? 'border-amber-500 bg-amber-50' 
                        : 'border-gray-200 hover:border-amber-300'
                    } shadow-md hover:shadow-lg`}
                    onClick={() => setSelectedBook(book._id)}
                  >
                    <div className="flex items-start gap-3">
                      {book.image ? (
                        <img
                          src={`http://localhost:8000${book.image}`}
                          alt={book.name}
                          className="w-16 h-20 object-contain rounded-lg shadow-sm"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`w-16 h-20 bg-amber-100 rounded-lg flex items-center justify-center shadow-sm ${book.image ? 'hidden' : 'flex'}`}>
                        <span className="text-2xl text-amber-600">📚</span>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 line-clamp-2">
                          {book.name || 'Unknown Book'}
                        </h3>
                        <p className="text-sm text-gray-600">by {book.author || 'Unknown Author'}</p>
                        <p className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full inline-block mt-1">
                          {book.category || 'No Category'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">ISBN: {book.isbn || 'N/A'}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-medium text-green-600">
                            {(book.availableCount !== undefined ? book.availableCount : (book.count || 0))} available
                          </span>
                          {selectedBook === book._id && (
                            <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                              Selected
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Reservation Form */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Reservation Details</h2>
            
            {selectedBook && (
              <div className="mb-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                <h3 className="font-semibold text-amber-800 mb-1">Selected Book:</h3>
                <p className="text-sm text-amber-700">
                  {books.find(b => b._id === selectedBook)?.name || 'Unknown Book'}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Date *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                />
              </div>

              <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Expected Return Date
  </label>
  <input
    type="date"
    value={calculateReturnDate(pickupDate)}
    readOnly
    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed outline-none"
  />
  <p className="text-xs text-gray-500 mt-1">
    Books must be returned within 2 weeks of pickup
  </p>
</div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Your contact number"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Information
                </label>
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                  <p className="text-sm text-amber-800">
                    <strong>Name:</strong> {userInfo?.name || "Loading..."}
                  </p>
                  <p className="text-sm text-amber-800">
                    <strong>Email:</strong> {userInfo?.email || "Loading..."}
                  </p>
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading || !selectedBook}
                className="w-full bg-amber-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {isLoading ? "Processing..." : "Reserve Book"}
              </motion.button>

              {!selectedBook && (
                <p className="text-sm text-red-600 text-center">
                  Please select a book to reserve
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookReservation;