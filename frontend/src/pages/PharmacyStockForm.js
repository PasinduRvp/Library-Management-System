import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PharmacyStockFormPage = () => {
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
    const navigate = useNavigate();

    useEffect(() => {
        if (formData.mfDate && formData.exDate) {
            const mfDate = new Date(formData.mfDate);
            const exDate = new Date(formData.exDate);
            
            if (exDate <= mfDate) {
                setErrors(prev => ({
                    ...prev,
                    exDate: "Expiry date must be after manufacturing date"
                }));
            } else if (errors.exDate === "Expiry date must be after manufacturing date") {
                const newErrors = {...errors};
                delete newErrors.exDate;
                setErrors(newErrors);
            }
        }
    }, [formData.mfDate, formData.exDate]);

    const validateForm = () => {
        const newErrors = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const mfDate = formData.mfDate ? new Date(formData.mfDate) : null;
        const exDate = formData.exDate ? new Date(formData.exDate) : null;

        if (!formData.stockName.trim()) {
            newErrors.stockName = "Item name is required";
        } else if (formData.stockName.trim().length < 3) {
            newErrors.stockName = "Item name must be at least 3 characters";
        }

        if (!formData.stockType) {
            newErrors.stockType = "Item type is required";
        }

        if (formData.stockCount === "" || formData.stockCount === null) {
            newErrors.stockCount = "Quantity is required";
        } else if (formData.stockCount < 1) {
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
        } else if (!/^\d{10}$/.test(formData.contact)) {
            newErrors.contact = "Please enter a valid 10-digit mobile number";
        }

        setErrors(newErrors);
        
        if (Object.keys(newErrors).length > 0) {
            Object.values(newErrors).forEach(error => toast.error(error));
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/add-stock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    stockCount: parseInt(formData.stockCount)
                }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Pharmacy item added successfully!");
                setTimeout(() => navigate("/pharmacy-lab-panel/all-stocks"), 1000);
                setFormData({
                    stockName: "",
                    stockType: "tablet",
                    stockCount: 1,
                    mfDate: "",
                    exDate: "",
                    company: "",
                    dealerName: "",
                    contact: ""
                });
            } else {
                toast.error(result.message || "Failed to save pharmacy item");
            }
        } catch (error) {
            toast.error("Network error. Please check your connection and try again.");
            console.error("Submission error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];
    const minExDate = formData.mfDate || today;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-center" />
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    {}
                    <div className="bg-blue-600 py-6 px-8">
                        <div className="flex items-center justify-center space-x-3">
                            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <h2 className="text-2xl font-bold text-white text-center">
                                Pharmacy Stock Form
                            </h2>
                        </div>
                        <p className="text-blue-100 text-center mt-2">
                            Please fill in all required fields marked with *
                        </p>
                    </div>

                    {}
                    <div className="p-6 sm:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {}
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-blue-800 border-b border-blue-200 pb-2">
                                    Item Information
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {}
                                    <div>
                                        <label htmlFor="stockName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Item Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                id="stockName"
                                                name="stockName"
                                                value={formData.stockName}
                                                onChange={handleChange}
                                                className={`pl-10 w-full px-4 py-2 border ${errors.stockName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                                placeholder="Enter item name"
                                                maxLength={50}
                                            />
                                        </div>
                                        {errors.stockName && <p className="mt-1 text-sm text-red-600">{errors.stockName}</p>}
                                    </div>

                                    {}
                                    <div>
                                        <label htmlFor="stockType" className="block text-sm font-medium text-gray-700 mb-1">
                                            Item Type <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                                </svg>
                                            </div>
                                            <select
                                                id="stockType"
                                                name="stockType"
                                                value={formData.stockType}
                                                onChange={handleChange}
                                                className={`pl-10 w-full px-4 py-2 border ${errors.stockType ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                            >
                                                <option value="tablet">Tablet</option>
                                                <option value="bottle">Bottle</option>
                                                 <option value="boxes">Box</option>
                                                <option value="other">Other</option>
                                               
                                            </select>
                                        </div>
                                        {errors.stockType && <p className="mt-1 text-sm text-red-600">{errors.stockType}</p>}
                                    </div>

                                    {}
                                    <div>
                                        <label htmlFor="stockCount" className="block text-sm font-medium text-gray-700 mb-1">
                                            Quantity <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </div>
                                            <input
                                                type="number"
                                                id="stockCount"
                                                name="stockCount"
                                                value={formData.stockCount}
                                                onChange={handleChange}
                                                min="1"
                                                max="10000"
                                                className={`pl-10 w-full px-4 py-2 border ${errors.stockCount ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                            />
                                        </div>
                                        {errors.stockCount && <p className="mt-1 text-sm text-red-600">{errors.stockCount}</p>}
                                    </div>

                                    {}
                                    <div>
                                        <label htmlFor="mfDate" className="block text-sm font-medium text-gray-700 mb-1">
                                            Manufacturing Date <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="date"
                                                id="mfDate"
                                                name="mfDate"
                                                value={formData.mfDate}
                                                onChange={handleChange}
                                                max={today}
                                                className={`pl-10 w-full px-4 py-2 border ${errors.mfDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                            />
                                        </div>
                                        {errors.mfDate && <p className="mt-1 text-sm text-red-600">{errors.mfDate}</p>}
                                    </div>

                                    {}
                                    <div>
                                        <label htmlFor="exDate" className="block text-sm font-medium text-gray-700 mb-1">
                                            Expiry Date <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="date"
                                                id="exDate"
                                                name="exDate"
                                                value={formData.exDate}
                                                onChange={handleChange}
                                                min={minExDate}
                                                className={`pl-10 w-full px-4 py-2 border ${errors.exDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                            />
                                        </div>
                                        {errors.exDate && <p className="mt-1 text-sm text-red-600">{errors.exDate}</p>}
                                    </div>
                                </div>
                            </div>

                            {}
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-blue-800 border-b border-blue-200 pb-2">
                                    Supplier Information
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {}
                                    <div>
                                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                                            Company <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                id="company"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                className={`pl-10 w-full px-4 py-2 border ${errors.company ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                                placeholder="Enter company name"
                                                maxLength={50}
                                            />
                                        </div>
                                        {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
                                    </div>

                                    {}
                                    <div>
                                        <label htmlFor="dealerName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Dealer Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                id="dealerName"
                                                name="dealerName"
                                                value={formData.dealerName}
                                                onChange={handleChange}
                                                className={`pl-10 w-full px-4 py-2 border ${errors.dealerName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                                placeholder="Enter dealer name"
                                                maxLength={50}
                                            />
                                        </div>
                                        {errors.dealerName && <p className="mt-1 text-sm text-red-600">{errors.dealerName}</p>}
                                    </div>

                                    {}
                                    <div>
                                        <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                                            Contact Number <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                id="contact"
                                                name="contact"
                                                value={formData.contact}
                                                onChange={handleChange}
                                                maxLength={10}
                                                className={`pl-10 w-full px-4 py-2 border ${errors.contact ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                                placeholder="Enter mobile number"
                                                inputMode="tel"
                                            />
                                        </div>
                                        {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact}</p>}
                                    </div>
                                </div>
                            </div>

                            {}
                            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate("/pharmacy-lab-panel/all-stocks")}
                                    className="px-6 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${
                                        isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Save Pharmacy Item
                                        </span>
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

export default PharmacyStockFormPage;