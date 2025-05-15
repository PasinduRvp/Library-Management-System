import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import SummaryApi from '../common/index';

const EditStockPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    stockName: "",
    stockType: "tablet",
    stockCount: 1,
    mfDate: "",
    exDate: "",
    company: "",
    dealerName: "",
    contact: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await fetch(`${SummaryApi.getStockById.url}/${id}`);
        const data = await response.json();
        
        if (response.ok) {
          setFormData({
            stockName: data.stockName,
            stockType: data.stockType || "tablet",
            stockCount: data.stockCount,
            mfDate: formatDateForInput(data.mfDate),
            exDate: formatDateForInput(data.exDate),
            company: data.company,
            dealerName: data.dealerName,
            contact: data.contact
          });
        } else {
          toast.error(data.message || "Failed to fetch stock item", {
            position: "top-center",
            duration: 4000,
          });
        }
      } catch (error) {
        console.error("Failed to fetch stock", error);
        toast.error("Failed to load stock item. Please try again.", {
          position: "top-center",
          duration: 4000,
        });
      }
    };
    
    fetchStock();
  }, [id]);

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const mfDate = formData.mfDate ? new Date(formData.mfDate) : null;
    const exDate = formData.exDate ? new Date(formData.exDate) : null;

    if (!formData.stockName.trim()) {
      newErrors.stockName = "Item name is required";
    }

    if (!formData.stockType) {
      newErrors.stockType = "Item type is required";
    }

    if (formData.stockCount === "" || formData.stockCount === null) {
      newErrors.stockCount = "Quantity is required";
    } else if (formData.stockCount < 0) {
      newErrors.stockCount = "Quantity must be at least 1";
    } else if (formData.stockCount > 10000) {
      newErrors.stockCount = "Quantity cannot exceed 10,000";
    }

    if (!formData.mfDate) {
      newErrors.mfDate = "Manufacturing date is required";
    } else if (mfDate > today) {
      newErrors.mfDate = "Manufacturing date cannot be in the future";
    }

    if (!formData.exDate) {
      newErrors.exDate = "Expiry date is required";
    } else if (exDate < today) {
      newErrors.exDate = "Expired items cannot be added";
    } else if (formData.mfDate && exDate <= mfDate) {
      newErrors.exDate = "Expiry date must be after manufacturing date";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    } else if (formData.company.trim().length < 2) {
      newErrors.company = "Company name must be at least 2 characters";
    }

    if (!formData.dealerName.trim()) {
      newErrors.dealerName = "Dealer name is required";
    } else if (formData.dealerName.trim().length < 2) {
      newErrors.dealerName = "Dealer name must be at least 2 characters";
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!/^[0-9]{10}$/.test(formData.contact)) {
      newErrors.contact = "Please enter a valid 10-digit number (without +94)";
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach(error => toast.error(error, {
        position: "top-center",
        duration: 4000,
      }));
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === "contact" 
          ? value.replace(/[^0-9]/g, "") 
          : name === "stockCount" 
              ? value === "" 
                  ? "" 
                  : Math.min(10000, parseInt(value) || 0)
              : value
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(SummaryApi.updateStock.url, {
        method: SummaryApi.updateStock.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({...formData, _id: id}),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Stock item updated successfully!", {
          position: "top-center",
          duration: 2000,
        });
        setTimeout(() => navigate("/pharmacy-lab-panel/all-stocks"), 1000);
      } else {
        toast.error(result.message || "Failed to update stock item.", {
          position: "top-center",
          duration: 4000,
        });
      }
    } catch (error) {
      toast.error("Network error. Please check your connection and try again.", {
        position: "top-center",
        duration: 4000,
      });
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const minExDate = formData.mfDate || today;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Form Header */}
          <div className="bg-blue-600 py-6 px-8">
            <h2 className="text-2xl font-bold text-white text-center">
              Edit Pharmacy Item
            </h2>
            <p className="text-blue-100 text-center mt-1">
              Update pharmacy stock details
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Item Name */}
                <div className="md:col-span-2">
                  <label htmlFor="stockName" className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="stockName"
                    name="stockName"
                    value={formData.stockName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${errors.stockName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    readOnly
                  />
                </div>

                {/* Item Type */}
                <div>
                  <label htmlFor="stockType" className="block text-sm font-medium text-gray-700 mb-1">
                    Item Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="stockType"
                    name="stockType"
                    value={formData.stockType}
                    readOnly
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${errors.stockType ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="tablet">Tablet</option>
                    <option value="bottle">Bottle</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.stockType && <p className="mt-1 text-sm text-red-600">{errors.stockType}</p>}
                </div>

                {/* Item Quantity */}
                <div>
                  <label htmlFor="stockCount" className="block text-sm font-medium text-gray-700 mb-1">
                    Item Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="stockCount"
                    name="stockCount"
                    value={formData.stockCount}
                    onChange={handleChange}
                    min="0"
                    max="10000"
                    className={`w-full px-4 py-2 border ${errors.stockCount ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Enter quantity"
                  />
                  {errors.stockCount && <p className="mt-1 text-sm text-red-600">{errors.stockCount}</p>}
                </div>

                {/* Manufacturing Date */}
                <div>
                  <label htmlFor="mfDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Manufacturing Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="mfDate"
                    name="mfDate"
                    value={formData.mfDate}
                    readOnly
                    onChange={handleDateChange}
                    max={today}
                    className={`w-full px-4 py-2 border ${errors.mfDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.mfDate && <p className="mt-1 text-sm text-red-600">{errors.mfDate}</p>}
                </div>

                {/* Expiry Date */}
                <div>
                  <label htmlFor="exDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="exDate"
                    name="exDate"
                    readOnly
                    value={formData.exDate}
                    onChange={handleDateChange}
                    min={minExDate}
                    className={`w-full px-4 py-2 border ${errors.exDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.exDate && <p className="mt-1 text-sm text-red-600">{errors.exDate}</p>}
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    readOnly
                    value={formData.company}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${errors.company ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Enter company name"
                    maxLength={50}
                  />
                  {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
                </div>

                {/* Dealer Name */}
                <div>
                  <label htmlFor="dealerName" className="block text-sm font-medium text-gray-700 mb-1">
                    Dealer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="dealerName"
                    name="dealerName"
                    readOnly
                    value={formData.dealerName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${errors.dealerName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Enter dealer name"
                    maxLength={50}
                  />
                  {errors.dealerName && <p className="mt-1 text-sm text-red-600">{errors.dealerName}</p>}
                </div>

                {/* Contact Number */}
                <div>
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="text"
                      id="contact"
                      name="contact"
                      readOnly
                      value={formData.contact}
                      onChange={handleChange}
                      maxLength={10}
                      className={`w-full px-4 py-2 border ${errors.contact ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter Mobile Number"
                      inputMode="tel"
                    />
                  </div>
                  {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact}</p>}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/pharmacy-lab-panel/all-stocks")}
                  className="px-6 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    "Update Pharmacy Item"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStockPage;