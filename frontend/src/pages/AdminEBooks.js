import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { 
  MdSearch, 
  MdDownload, 
  MdEdit, 
  MdDelete, 
  MdAdd,
  MdUpload 
} from "react-icons/md";
import { motion } from "framer-motion";
import SummaryApi from "../common";

const AdminEBooks = () => {
  const [ebooks, setEBooks] = useState([]);
  const [filteredEBooks, setFilteredEBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEBook, setSelectedEBook] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    author: "",
    isbn: "",
    category: "",
    pageCount: "",
    description: "",
    image: null,
    pdf: null
  });

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
    "Education"
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
      filtered = filtered.filter(ebook =>
        ebook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ebook.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ebook.isbn.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== "All") {
      filtered = filtered.filter(ebook => ebook.category === selectedCategory);
    }
    
    setFilteredEBooks(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const handleAddEBook = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.author || !formData.isbn || !formData.category || !formData.pageCount) {
      return toast.error("Please fill in all required fields");
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("author", formData.author);
    data.append("isbn", formData.isbn);
    data.append("category", formData.category);
    data.append("pageCount", formData.pageCount);
    data.append("description", formData.description);
    if (formData.image) data.append("image", formData.image);
    if (formData.pdf) data.append("pdf", formData.pdf);

    try {
      const response = await fetch(SummaryApi.addEBook.url, {
        method: SummaryApi.addEBook.method,
        credentials: "include",
        body: data,
      });

      const result = await response.json();
      if (result.success) {
        toast.success("E-Book added successfully!");
        setShowAddModal(false);
        setFormData({
          name: "",
          author: "",
          isbn: "",
          category: "",
          pageCount: "",
          description: "",
          image: null,
          pdf: null
        });
        fetchEBooks();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error adding e-book");
    }
  };

  const handleDeleteEBook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this e-book?")) return;

    try {
      const response = await fetch(SummaryApi.deleteEBook.url(id), {
        method: SummaryApi.deleteEBook.method,
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        toast.success("E-Book deleted successfully!");
        fetchEBooks();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error deleting e-book");
    }
  };

  const openEditModal = (ebook) => {
    setSelectedEBook(ebook);
    setFormData({
      name: ebook.name,
      author: ebook.author,
      isbn: ebook.isbn,
      category: ebook.category,
      pageCount: ebook.pageCount.toString(),
      description: ebook.description || "",
      image: null,
      pdf: null
    });
    setShowEditModal(true);
  };

  const handleUpdateEBook = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.author || !formData.isbn || !formData.category || !formData.pageCount) {
      return toast.error("Please fill in all required fields");
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("author", formData.author);
    data.append("isbn", formData.isbn);
    data.append("category", formData.category);
    data.append("pageCount", formData.pageCount);
    data.append("description", formData.description);
    if (formData.image) data.append("image", formData.image);
    if (formData.pdf) data.append("pdf", formData.pdf);

    try {
      const response = await fetch(SummaryApi.updateEBook.url(selectedEBook._id), {
        method: SummaryApi.updateEBook.method,
        credentials: "include",
        body: data,
      });

      const result = await response.json();
      if (result.success) {
        toast.success("E-Book updated successfully!");
        setShowEditModal(false);
        setSelectedEBook(null);
        setFormData({
          name: "",
          author: "",
          isbn: "",
          category: "",
          pageCount: "",
          description: "",
          image: null,
          pdf: null
        });
        fetchEBooks();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error updating e-book");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">E-Books Management</h1>
              <p className="text-gray-600">Manage your digital library collection</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="bg-amber-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-amber-700 transition-all shadow-md hover:shadow-lg"
            >
              <MdAdd className="text-xl" />
              Add New E-Book
            </motion.button>
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
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEBooks.map((ebook) => (
              <motion.div
                key={ebook._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={`http://localhost:8000${ebook.image}`}
                    alt={ebook.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZDN0YwIi8+CjxwYXRoIGQ9Ik01MCA1MEgxNTBWMTUwSDUwVjUwWiIgZmlsbD0iI0ZBOEUwMCIvPgo8cGF0aCBkPSJNNzUgNzVIMTI1VjEyNUg3NVY3NVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==";
                    }}
                  />
                </div>
                
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                    {ebook.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">by {ebook.author}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {ebook.category}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {ebook.pageCount} pages
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-gray-500 text-sm">
                      {ebook.downloads} downloads
                    </span>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openEditModal(ebook)}
                        className="p-2 bg-amber-100 text-amber-600 rounded-full hover:bg-amber-200 transition-colors"
                        title="Edit E-Book"
                      >
                        <MdEdit className="text-xl" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteEBook(ebook._id)}
                        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                        title="Delete E-Book"
                      >
                        <MdDelete className="text-xl" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No e-books found</h3>
            <p className="text-gray-500">
              {searchQuery || selectedCategory !== "All" 
                ? "Try adjusting your search or filter criteria" 
                : "Get started by adding your first e-book"}
            </p>
          </div>
        )}
      </div>

      {/* Add E-Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Add New E-Book</h3>
            </div>
            
            <form onSubmit={handleAddEBook} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ISBN *</label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  >
                    <option value="">Select Category</option>
                    {categories.filter(cat => cat !== "All").map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Page Count *</label>
                  <input
                    type="number"
                    name="pageCount"
                    value={formData.pageCount}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image *</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <MdUpload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500">
                        {formData.image ? formData.image.name : "Click to upload image"}
                      </p>
                    </div>
                    <input 
                      type="file" 
                      name="image"
                      onChange={handleFileChange}
                      accept="image/*"
                      required
                      className="hidden" 
                    />
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PDF File *</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <MdUpload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500">
                        {formData.pdf ? formData.pdf.name : "Click to upload PDF"}
                      </p>
                    </div>
                    <input 
                      type="file" 
                      name="pdf"
                      onChange={handleFileChange}
                      accept=".pdf"
                      required
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Add E-Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit E-Book Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Edit E-Book</h3>
            </div>
            
            <form onSubmit={handleUpdateEBook} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ISBN *</label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  >
                    <option value="">Select Category</option>
                    {categories.filter(cat => cat !== "All").map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Page Count *</label>
                  <input
                    type="number"
                    name="pageCount"
                    value={formData.pageCount}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <MdUpload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500">
                        {formData.image ? formData.image.name : "Click to upload new image (optional)"}
                      </p>
                    </div>
                    <input 
                      type="file" 
                      name="image"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden" 
                    />
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PDF File</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <MdUpload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500">
                        {formData.pdf ? formData.pdf.name : "Click to upload new PDF (optional)"}
                      </p>
                    </div>
                    <input 
                      type="file" 
                      name="pdf"
                      onChange={handleFileChange}
                      accept=".pdf"
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedEBook(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Update E-Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEBooks;