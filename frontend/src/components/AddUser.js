import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaKey, FaUserCircle, FaGraduationCap, FaCalendarAlt } from 'react-icons/fa';
import { IoClose, IoSave } from "react-icons/io5";
import imageTobase64 from '../helpers/imageTobase64';
import SummaryApi from '../common';
import { toast } from "react-toastify";
import defaultProfilePic from '../assest/loginIcon.jpg';
import ROLE from '../common/role';

const AddUser = ({ onClose, fetchAllUsers }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCheckingIndex, setIsCheckingIndex] = useState(false);
    const [indexNumberExists, setIndexNumberExists] = useState(false);
    
    const [data, setData] = useState({
        email: "",
        password: "",
        name: "",
        confirmPassword: "",
        profilePic: "",
        role: "",
        indexNumber: "",
        year: "",
        semester: ""
    });

    const [errors, setErrors] = useState({});

    const years = ['Y1', 'Y2', 'Y3'];
    const semesters = ['S1', 'S2'];

    const checkIndexNumberExists = async (indexNumber) => {
        if (!indexNumber || data.role !== ROLE.STUDENT) return false;
        
        try {
            setIsCheckingIndex(true);
            const response = await fetch(`${SummaryApi.checkIndexNumber.url}?indexNumber=${indexNumber}`);
            const result = await response.json();
            
            if (response.ok) {
                setIndexNumberExists(result.exists);
                if (result.exists) {
                    setErrors(prev => ({
                        ...prev,
                        indexNumber: "This index number is already in use"
                    }));
                }
                return result.exists;
            }
            return false;
        } catch (error) {
            console.error("Error checking index number:", error);
            return false;
        } finally {
            setIsCheckingIndex(false);
        }
    };

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
        
        if (name === 'indexNumber' && data.role === ROLE.STUDENT) {
            setIndexNumberExists(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (data.role === ROLE.STUDENT && data.indexNumber) {
                checkIndexNumberExists(data.indexNumber);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [data.indexNumber, data.role]);

    const handleUploadPic = async(e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const imagePic = await imageTobase64(file);
            setData(prev => ({ ...prev, profilePic: imagePic }));
            toast.success("Image uploaded successfully");
        } catch (error) {
            toast.error("Failed to upload image");
            console.error("Image upload error:", error);
        }
    };

    const validateForm = async () => {
        let isValid = true;
        const newErrors = {};

        if (!data.email) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = "Email is invalid";
            isValid = false;
        }

        if (!data.name) {
            newErrors.name = "Name is required";
            isValid = false;
        }

        if (!data.role) {
            newErrors.role = "Role is required";
            isValid = false;
        }

        if (data.role === ROLE.STUDENT) {
            if (!data.indexNumber) {
                newErrors.indexNumber = "Index number is required for students";
                isValid = false;
            } else if (await checkIndexNumberExists(data.indexNumber)) {
                newErrors.indexNumber = "This index number is already in use";
                isValid = false;
            }

            if (!data.year) {
                newErrors.year = "Year is required for students";
                isValid = false;
            }

            if (!data.semester) {
                newErrors.semester = "Semester is required for students";
                isValid = false;
            }
        }

        if (!data.password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (data.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        if (!data.confirmPassword) {
            newErrors.confirmPassword = "Please confirm password";
            isValid = false;
        } else if (data.password !== data.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        if (!(await validateForm())) {
            return;
        }

        setIsSubmitting(true);

        try {
            const { confirmPassword, ...payload } = data;

            const response = await fetch(SummaryApi.signUp.url, {
                method: SummaryApi.signUp.method,
                headers: { 
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || "Failed to create user");
            }

            toast.success(responseData.message || "User created successfully");
            fetchAllUsers();
            onClose();
            
        } catch (error) {
            console.error("Error creating user:", error);
            toast.error(error.message || "An error occurred while creating user");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center border-b p-6 sticky top-0 bg-white z-10">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <FaUserCircle className="mr-3 text-blue-500" />
                        Add New User
                    </h2>
                    <button 
                        onClick={() => onClose()}
                        className="text-gray-500 hover:text-red-600 transition-colors p-1"
                        disabled={isSubmitting}
                    >
                        <IoClose className="text-2xl" />
                    </button>
                </div>

                {/* Main Form Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100">
                            <img 
                                src={data.profilePic || defaultProfilePic} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                            <label className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    onChange={handleUploadPic}
                                    accept="image/*"
                                    disabled={isSubmitting}
                                />
                                <span className="text-white text-xs font-medium">Change Photo</span>
                            </label>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Click photo to upload</p>
                    </div>

                    {/* Name Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <FaUser className="mr-2 text-blue-500" />
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter full name"
                            name="name"
                            value={data.name}
                            onChange={handleOnChange}
                            className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            disabled={isSubmitting}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <FaEnvelope className="mr-2 text-blue-500" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            value={data.email}
                            onChange={handleOnChange}
                            className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            disabled={isSubmitting}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <FaUserCircle className="mr-2 text-blue-500" />
                            User Role
                        </label>
                        <select
                            name="role"
                            value={data.role}
                            onChange={handleOnChange}
                            className={`w-full p-3 border ${errors.role ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            disabled={isSubmitting}
                        >
                            <option value="">Select a role</option>
                            {Object.values(ROLE).map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                        {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                    </div>

                    {/* Student Specific Fields */}
                    {data.role === ROLE.STUDENT && (
                        <>
                            {/* Index Number */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <FaGraduationCap className="mr-2 text-blue-500" />
                                    Index Number
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter index number"
                                        name="indexNumber"
                                        value={data.indexNumber}
                                        onChange={handleOnChange}
                                        className={`w-full p-3 border ${errors.indexNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                        disabled={isSubmitting || isCheckingIndex}
                                    />
                                    {isCheckingIndex && (
                                        <div className="absolute right-3 top-3.5">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                        </div>
                                    )}
                                </div>
                                {errors.indexNumber && <p className="text-red-500 text-xs mt-1">{errors.indexNumber}</p>}
                            </div>

                            {/* Year Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <FaCalendarAlt className="mr-2 text-blue-500" />
                                    Year
                                </label>
                                <select
                                    name="year"
                                    value={data.year}
                                    onChange={handleOnChange}
                                    className={`w-full p-3 border ${errors.year ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                    disabled={isSubmitting}
                                >
                                    <option value="">Select year</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                                {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
                            </div>

                            {/* Semester Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <FaCalendarAlt className="mr-2 text-blue-500" />
                                    Semester
                                </label>
                                <select
                                    name="semester"
                                    value={data.semester}
                                    onChange={handleOnChange}
                                    className={`w-full p-3 border ${errors.semester ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                    disabled={isSubmitting}
                                >
                                    <option value="">Select semester</option>
                                    {semesters.map(semester => (
                                        <option key={semester} value={semester}>{semester}</option>
                                    ))}
                                </select>
                                {errors.semester && <p className="text-red-500 text-xs mt-1">{errors.semester}</p>}
                            </div>
                        </>
                    )}

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <FaKey className="mr-2 text-blue-500" />
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                name="password"
                                value={data.password}
                                onChange={handleOnChange}
                                className={`w-full p-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10`}
                                disabled={isSubmitting}
                                minLength={6}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3.5 text-gray-500 hover:text-blue-600"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isSubmitting}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                            <FaKey className="mr-2 text-blue-500" />
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm password"
                                name="confirmPassword"
                                value={data.confirmPassword}
                                onChange={handleOnChange}
                                className={`w-full p-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10`}
                                disabled={isSubmitting}
                                minLength={6}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3.5 text-gray-500 hover:text-blue-600"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isSubmitting}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>

                    {/* Form Actions */}
                    <div className="border-t pt-6 pb-2 bg-white sticky bottom-0">
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => onClose()}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-70"
                                disabled={isSubmitting || isCheckingIndex}
                            >
                                <IoSave className="mr-2" />
                                {isSubmitting ? 'Creating...' : 'Create User'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUser;