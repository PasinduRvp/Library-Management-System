import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LaboratoryItemFormPage = () => {
    const [formData, setFormData] = useState({
        itemName: "",
        itemCount: 1
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.itemName.trim()) {
            newErrors.itemName = "Item name is required";
        } else if (formData.itemName.trim().length < 3) {
            newErrors.itemName = "Item name must be at least 3 characters";
        }

        if (!formData.itemCount || formData.itemCount < 1) {
            newErrors.itemCount = "Valid quantity is required (minimum 1)";
        } else if (formData.itemCount > 1000) {
            newErrors.itemCount = "Quantity cannot exceed 1000";
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
            [name]: name === "itemCount" ? 
                   (value === "" ? "" : Math.min(1000, parseInt(value) || 0)) : 
                   value
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
            const response = await fetch("http://localhost:8000/api/add-item", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    itemCount: parseInt(formData.itemCount)
                }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Item added successfully!");
                setTimeout(() => navigate('/pharmacy-lab-panel/all-items'), 1000);
                setFormData({
                    itemName: "",
                    itemCount: 1
                });
            } else {
                toast.error(result.message || "Failed to save item data");
            }
        } catch (error) {
            toast.error("Network error. Please check your connection and try again.");
            console.error("Submission error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-center" />
            <div className="max-w-md mx-auto">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    {}
                    <div className="bg-blue-600 py-6 px-8">
                        <div className="flex items-center justify-center space-x-3">
                            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <h2 className="text-2xl font-bold text-white text-center">
                                Laboratory Item Form
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
                                
                                <div className="grid grid-cols-1 gap-6">
                                    {}
                                    <div>
                                        <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Item Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                id="itemName"
                                                name="itemName"
                                                value={formData.itemName}
                                                onChange={handleChange}
                                                className={`pl-10 w-full px-4 py-2 border ${errors.itemName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                                placeholder="Enter item name"
                                                maxLength={50}
                                            />
                                        </div>
                                        {errors.itemName && <p className="mt-1 text-sm text-red-600">{errors.itemName}</p>}
                                    </div>

                                    {}
                                    <div>
                                        <label htmlFor="itemCount" className="block text-sm font-medium text-gray-700 mb-1">
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
                                                id="itemCount"
                                                name="itemCount"
                                                value={formData.itemCount}
                                                onChange={handleChange}
                                                min="1"
                                                max="1000"
                                                className={`pl-10 w-full px-4 py-2 border ${errors.itemCount ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                            />
                                        </div>
                                        {errors.itemCount && <p className="mt-1 text-sm text-red-600">{errors.itemCount}</p>}
                                    </div>
                                </div>
                            </div>

                            {}
                            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate('/pharmacy-lab-panel/all-items')}
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
                                            Save Laboratory Item
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

export default LaboratoryItemFormPage;