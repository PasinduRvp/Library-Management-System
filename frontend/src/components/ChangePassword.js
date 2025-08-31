// components/ChangePassword.js
import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaKey, FaLock, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const ChangePassword = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');

    const validateForm = () => {
        const newErrors = {};
        setApiError('');

        if (!formData.currentPassword) {
            newErrors.currentPassword = "Current password is required";
        }

        if (!formData.newPassword) {
            newErrors.newPassword = "New password is required";
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = "Password must be at least 6 characters";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your new password";
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        
        if (apiError) {
            setApiError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setApiError('');

        try {
            const response = await fetch(SummaryApi.changePassword.url, {
                method: SummaryApi.changePassword.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message || "Password changed successfully!");
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                onSuccess();
            } else {
                const errorMsg = data.message || "Failed to change password";
                setApiError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (error) {
            console.error('Password change error:', error);
            const errorMsg = "Network error. Please check your connection and try again.";
            setApiError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                <FaLock className="mr-2 text-amber-600" />
                Change Password
            </h2>
            <p className="text-gray-600 mb-6">Update your account password</p>

            {apiError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center">
                    <FaExclamationTriangle className="mr-2" />
                    {apiError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Current Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FaKey className="mr-2 text-amber-600 text-sm" />
                        Current Password
                    </label>
                    <div className="relative">
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            className={`w-full p-3 border ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all pr-10`}
                            placeholder="Enter current password"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-3.5 text-gray-500 hover:text-amber-600"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            disabled={isLoading}
                        >
                            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {errors.currentPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
                    )}
                </div>

                {/* New Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className={`w-full p-3 border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all pr-10`}
                            placeholder="Enter new password (min. 6 characters)"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-3.5 text-gray-500 hover:text-amber-600"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            disabled={isLoading}
                        >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {errors.newPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`w-full p-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all pr-10`}
                            placeholder="Confirm new password"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-3.5 text-gray-500 hover:text-amber-600"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            disabled={isLoading}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                    )}
                </div>

                {/* Password Requirements */}
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <p className="text-xs font-medium text-amber-700 mb-2">Password Requirements:</p>
                    <ul className="text-xs text-amber-600 space-y-1">
                        <li className="flex items-center">
                            <FaCheck className="mr-1 text-green-500 text-xs" />
                            Minimum 6 characters
                        </li>
                        <li className="flex items-center">
                            <FaCheck className="mr-1 text-green-500 text-xs" />
                            Should not match current password
                        </li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Changing...
                            </>
                        ) : (
                            'Change Password'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;