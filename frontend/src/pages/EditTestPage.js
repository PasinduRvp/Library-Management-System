import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SummaryApi from "../common/index";

const EditTestPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        ageYears: "",
        ageMonths: "0",
        address: "",
        mobile: "",
        gender: "",
        testDate: "",
        testData: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    
    const formatDateForDisplay = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "N/A";
        
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    
    const formatAge = (years, months) => {
        if (years === 0) {
            return `${months} month${months !== 1 ? 's' : ''}`;
        }
        return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
    };

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const response = await fetch(`${SummaryApi.getTestById.url}/${id}`, {
                    method: SummaryApi.getTestById.method,
                });

                const result = await response.json();

                if (response.ok && result.data) {
                    setFormData({
                        ...result.data,
                        testDate: result.data.testDate,
                        mobile: result.data.mobile?.toString() || "",
                        ageYears: result.data.ageYears?.toString() || "",
                        ageMonths: result.data.ageMonths?.toString() || "0"
                    });
                } else {
                    toast.error(result.message || "Failed to fetch test data.");
                }
            } catch (error) {
                toast.error("Error fetching test. Please try again.");
            }
        };

        fetchTest();
    }, [id]);

    const validateForm = () => {
        const newErrors = {};
    
        
        if (!formData.testData.trim()) {
            newErrors.testData = "Test data is required";
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
        
        if (name === "testData") {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`${SummaryApi.updateTest.url.replace(":id", id)}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    
                    testData: formData.testData.trim()
                }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Test results updated successfully!");
                setTimeout(() => navigate('/pharmacy-lab-panel/all-tests'), 1000);
            } else {
                toast.error(result.message || "Failed to update test results.");
            }
        } catch (error) {
            toast.error("Network error. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    {}
                    <div className="bg-blue-600 py-6 px-8">
                        <div className="flex items-center justify-center space-x-3">
                            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            <h2 className="text-2xl font-bold text-white text-center">
                                Update Test Results
                            </h2>
                        </div>
                        <p className="text-blue-100 text-center mt-2">
                            You can only update the test results data
                        </p>
                    </div>

                    {}
                    <div className="p-6 sm:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {}
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-blue-800 border-b border-blue-200 pb-2">
                                    Patient Information
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name
                                        </label>
                                        <div className="p-2 bg-gray-50 rounded-md border border-gray-200">
                                            <p className="text-gray-800">{formData.name || "N/A"}</p>
                                        </div>
                                    </div>

                                    {}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Age
                                        </label>
                                        <div className="p-2 bg-gray-50 rounded-md border border-gray-200">
                                            <p className="text-gray-800">
                                                {formatAge(parseInt(formData.ageYears), parseInt(formData.ageMonths))}
                                            </p>
                                        </div>
                                    </div>

                                    {}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Address
                                        </label>
                                        <div className="p-2 bg-gray-50 rounded-md border border-gray-200">
                                            <p className="text-gray-800">{formData.address || "N/A"}</p>
                                        </div>
                                    </div>

                                    {}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mobile Number
                                        </label>
                                        <div className="p-2 bg-gray-50 rounded-md border border-gray-200">
                                            <p className="text-gray-800">{formData.mobile || "N/A"}</p>
                                        </div>
                                    </div>

                                    {}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Gender
                                        </label>
                                        <div className="p-2 bg-gray-50 rounded-md border border-gray-200">
                                            <p className="text-gray-800">{formData.gender || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {}
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-blue-800 border-b border-blue-200 pb-2">
                                    Test Information
                                </h3>
                                
                                <div className="grid grid-cols-1 gap-6">
                                    {}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Test Date
                                        </label>
                                        <div className="p-2 bg-gray-50 rounded-md border border-gray-200">
                                            <p className="text-gray-800">
                                                {formatDateForDisplay(formData.testDate)}
                                            </p>
                                        </div>
                                    </div>

                                    {}
                                    <div>
                                        <label htmlFor="testData" className="block text-sm font-medium text-gray-700 mb-1">
                                            Test Results <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                id="testData"
                                                name="testData"
                                                value={formData.testData}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-2 border ${errors.testData ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-40`}
                                                placeholder="Enter test details, observations, and results..."
                                            />
                                        </div>
                                        {errors.testData && <p className="mt-1 text-sm text-red-600">{errors.testData}</p>}
                                    </div>
                                </div>
                            </div>

                            {}
                            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate('/pharmacy-lab-panel/all-tests')}
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
                                            Updating...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Update Results
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

export default EditTestPage;