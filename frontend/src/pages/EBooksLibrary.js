import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { MdSearch, MdVisibility, MdClose, MdZoomOut, MdZoomIn } from "react-icons/md";
import { motion } from "framer-motion";
import SummaryApi from "../common";

const EBooksLibrary = () => {
  const [ebooks, setEBooks] = useState([]);
  const [filteredEBooks, setFilteredEBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookContent, setBookContent] = useState("");
  const [isBookLoading, setIsBookLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const categories = [
    "All",
    "Fiction",
    "Non-Fiction",
    "Science",
    "Technology",
    "Medicine",
    "History",
    "Biography",
    "Self-Help",
    "Business",
    "Education",
  ];

  useEffect(() => {
    fetchEBooks();
  }, []);

  useEffect(() => {
    filterEBooks();
  }, [ebooks, searchQuery, selectedCategory]);

  const fetchEBooks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(SummaryApi.getEBooks.url, {
        method: SummaryApi.getEBooks.method,
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setEBooks(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error fetching e-books");
    } finally {
      setIsLoading(false);
    }
  };

  const filterEBooks = () => {
    let filtered = ebooks;

    if (searchQuery) {
      filtered = filtered.filter(
        (ebook) =>
          ebook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ebook.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ebook.isbn.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (ebook) => ebook.category === selectedCategory
      );
    }

    setFilteredEBooks(filtered);
  };

  const handleViewBook = async (ebook) => {
    try {
      setIsBookLoading(true);
      setSelectedBook(ebook);
      setZoomLevel(1); // Reset zoom level when opening new book
      
      // Fetch book content for viewing
      const response = await fetch(SummaryApi.viewEBook.url(ebook._id), {
        method: SummaryApi.viewEBook.method,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to load book content");
      }

      // For PDF files, create a blob URL for PDF viewing
      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      setBookContent(pdfUrl);

      toast.success("Book opened successfully!");
    } catch (error) {
      toast.error("Error opening e-book");
      setSelectedBook(null);
    } finally {
      setIsBookLoading(false);
    }
  };

  const closeBookViewer = () => {
    setSelectedBook(null);
    setBookContent("");
    setZoomLevel(1);
    // Clean up blob URL if it was created
    if (bookContent && bookContent.startsWith("blob:")) {
      URL.revokeObjectURL(bookContent);
    }
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2)); // Max zoom 200%
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5)); // Min zoom 50%
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              E-Books Library
            </h1>
            <p className="text-gray-600">
              Discover and read our digital collection
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdSearch className="text-gray-400 text-xl" />
              </div>
              <input
                type="text"
                placeholder="Search e-books by title, author, or ISBN..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* E-Books Grid */}
        {isLoading ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : filteredEBooks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredEBooks.map((ebook) => (
              <motion.div
                key={ebook._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="h-36 overflow-hidden">
                  <img
                    src={`http://localhost:8000${ebook.image}`}
                    alt={ebook.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZDN0YwIi8+CjxwYXRoIGQ9Ik01MCA1MEgxNTBWMTUwSDUwVjUwWiIgZmlsbD0iI0ZBOEUwMCIvPgo8cGF0aCBkPSJNNzUgNzVIMTI1VjEyNUg3NVY3NVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==";
                    }}
                  />
                </div>

                <div className="p-3">
                  <h3 className="font-semibold text-base text-gray-800 mb-1 line-clamp-2">
                    {ebook.name}
                  </h3>
                  <p className="text-gray-600 text-xs mb-1">by {ebook.author}</p>

                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-medium px-2 py-0.5 rounded">
                      {ebook.category}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {ebook.pageCount} pages
                    </span>
                  </div>

                  {ebook.description && (
                    <p className="text-gray-700 text-xs mb-3 line-clamp-2">
                      {ebook.description}
                    </p>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs">
                      {ebook.views || 0} views
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleViewBook(ebook)}
                      className="bg-amber-600 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1 hover:bg-amber-700 transition-all"
                    >
                      <MdVisibility className="text-sm" />
                      Read
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No e-books found
            </h3>
            <p className="text-gray-500">
              {searchQuery || selectedCategory !== "All"
                ? "Try adjusting your search or filter criteria"
                : "Check back soon for new additions to our e-library"}
            </p>
          </div>
        )}
      </div>

      {/* Book Viewer Modal - LARGER SIZE */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-800 truncate">
                  {selectedBook.name}
                </h2>
                <p className="text-gray-600 text-lg">by {selectedBook.author}</p>
              </div>
              
              {/* Zoom Controls */}
              <div className="flex items-center gap-3 mx-4">
                <button
                  onClick={zoomOut}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Zoom Out"
                >
                  <MdZoomOut className="text-xl text-gray-700" />
                </button>
                <span className="text-sm font-medium text-gray-700 min-w-[50px] text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Zoom In"
                >
                  <MdZoomIn className="text-xl text-gray-700" />
                </button>
                <button
                  onClick={resetZoom}
                  className="p-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium"
                >
                  Reset
                </button>
              </div>

              <button
                onClick={closeBookViewer}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MdClose className="text-2xl text-gray-600" />
              </button>
            </div>

            {/* Modal Content - MUCH LARGER */}
            <div className="flex-1 overflow-hidden relative">
              {isBookLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-amber-500"></div>
                </div>
              ) : bookContent ? (
                <div className="h-full w-full overflow-auto bg-gray-100">
                  <div 
                    className="flex justify-center items-start p-8 min-h-full"
                    style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center top' }}
                  >
                    <iframe
                      src={bookContent}
                      className="w-full max-w-4xl h-[80vh] border-0 shadow-2xl rounded-lg bg-white"
                      title={`${selectedBook.name} - PDF Viewer`}
                      style={{ 
                        minHeight: '800px',
                        width: '100%',
                        maxWidth: '1200px'
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center h-full">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📖</div>
                    <p className="text-gray-600 text-xl">Unable to load book content</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex-shrink-0">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-6 text-base">
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                    📚 {selectedBook.category}
                  </span>
                  <span>📄 {selectedBook.pageCount} pages</span>
                  <span>👁️ {selectedBook.views || 0} views</span>
                  <span>🔍 {selectedBook.isbn}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    Use zoom controls to adjust viewing size
                  </span>
                  <button
                    onClick={closeBookViewer}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors text-base"
                  >
                    Close Viewer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EBooksLibrary;