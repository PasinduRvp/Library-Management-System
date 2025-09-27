// Profile.js - UPDATED WITH USER-FRIENDLY QR CODE DATA
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  MdModeEdit, MdLogout, MdSecurity, MdPerson, MdInfo, MdSave, 
  MdCancel, MdCameraAlt, MdPayment, MdHistory, MdQrCode,
  MdContentCopy, MdCheckCircle
} from 'react-icons/md';
import { FaUserShield, FaUser, FaIdCard, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import SummaryApi from '../common';
import ChangePassword from '../components/ChangePassword';
import imageTobase64 from '../helpers/imageTobase64';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('personal');
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [membershipSlip, setMembershipSlip] = useState(null);
    const [showQRCode, setShowQRCode] = useState(false);
    const [copiedField, setCopiedField] = useState(null);
    const navigate = useNavigate();

    const getDefaultProfilePic = (name = 'User') => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;
    };

    const fetchUserDetails = async () => {
        try {
            const response = await fetch(SummaryApi.current_user.url, {
                method: SummaryApi.current_user.method,
                credentials: 'include'
            });
            const dataResponse = await response.json();

            if (dataResponse.success) {
                console.log("User data fetched:", {
                    name: dataResponse.data.name,
                    membershipStatus: dataResponse.data.membershipStatus,
                    hasPaymentSlip: !!dataResponse.data.membershipPayment?.slipImage
                });
                setUserData(dataResponse.data);
                setEditData(dataResponse.data);
            } else {
                toast.error(dataResponse.message);
                navigate('/login');
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            toast.error("Error fetching user details");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch(SummaryApi.logout_user.url, {
                method: SummaryApi.logout_user.method,
                credentials: 'include'
            });
            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                navigate('/login');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Error logging out");
        }
    };

    const showLogoutConfirmation = () => {
        toast.info(
            <div className="p-4">
                <p className="text-gray-800 font-medium text-lg mb-4 text-center">Are you sure you want to logout?</p>
                <div className="flex justify-center gap-3">
                    <button
                        onClick={() => {
                            handleLogout();
                            toast.dismiss();
                        }}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
                    >
                        Yes, Logout
                    </button>
                    <button
                        onClick={() => {
                            toast.dismiss();
                            toast.info('Logout cancelled');
                        }}
                        className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg transition-colors shadow-md"
                    >
                        Cancel
                    </button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                className: "shadow-xl rounded-xl"
            }
        );
    };

    const handleEditToggle = () => {
        if (isEditing) {
            setEditData(userData);
        }
        setIsEditing(!isEditing);
    };

    const handleEditChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleProfilePicUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const imagePic = await imageTobase64(file);
            setEditData(prev => ({
                ...prev,
                profilePic: imagePic
            }));
            toast.success("Profile picture uploaded successfully");
        } catch (error) {
            toast.error(error.message || "Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(SummaryApi.updateUser.url, {
                method: SummaryApi.updateUser.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userData._id,
                    name: editData.name,
                    email: editData.email,
                    profilePic: editData.profilePic,
                    contactNumber: editData.contactNumber,
                    address: editData.address
                })
            });

            const data = await response.json();

            if (data.success) {
                setUserData(data.data);
                setIsEditing(false);
                toast.success("Profile updated successfully!");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Error updating profile");
        } finally {
            setIsSaving(false);
        }
    };

    // Copy to clipboard function
    const copyToClipboard = async (text, fieldName) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(fieldName);
            toast.success(`${fieldName} copied to clipboard!`);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            toast.error('Failed to copy text');
        }
    };

    // FIXED: Membership slip upload with better debugging
    const handleMembershipSlipUpload = async (e) => {
        e.preventDefault();
        
        console.log("=== FRONTEND: MEMBERSHIP SLIP UPLOAD ===");
        console.log("File selected:", membershipSlip);
        console.log("Current user status:", userData?.membershipStatus);
        
        if (!membershipSlip) {
            return toast.error("Please select a payment slip");
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("slipImage", membershipSlip);
            
            // Set expiry date to 1 year from now
            const expiryDate = new Date();
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            formData.append("expiryDate", expiryDate.toISOString().split('T')[0]);

            console.log("Uploading to:", SummaryApi.uploadMembershipSlip.url);
            console.log("File name:", membershipSlip.name);
            console.log("File size:", membershipSlip.size);

            const response = await fetch(SummaryApi.uploadMembershipSlip.url, {
                method: SummaryApi.uploadMembershipSlip.method,
                credentials: 'include',
                body: formData
            });

            console.log("Upload response status:", response.status);
            
            const data = await response.json();
            console.log("Upload response data:", data);
            
            if (data.success) {
                toast.success("Membership payment slip uploaded successfully! Please wait for admin approval.");
                setMembershipSlip(null);
                
                // Force refresh user data
                setTimeout(() => {
                    fetchUserDetails();
                }, 1000);
            } else {
                toast.error(data.message || "Failed to upload membership slip");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Error uploading membership slip: " + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    // UPDATED: Generate user-friendly QR code data
    const generateQRData = () => {
        if (!userData) return '';
        
        // Create a structured, readable format for QR code scanning
        return `LIBRARY MEMBERSHIP CARD

Member Information:
Name: ${userData.name}
Email: ${userData.email}
Registration: ${userData.registrationNumber || 'Pending'}
Contact: ${userData.contactNumber || 'Not provided'}

Membership Status:
Status: ${userData.membershipStatus || 'Not registered'}
Expiry: ${userData.membershipExpiry ? new Date(userData.membershipExpiry).toLocaleDateString() : 'Not available'}
Outstanding Fines: Rs. ${userData.fines || 0}`;
    };

    // NEW: Component to display QR code data in user-friendly format
    const QRCodeDataDisplay = () => {
        if (!userData) return null;

        const qrData = {
            "Library Membership Card": "",
            "Member Information": "",
            "Name": userData.name,
            "Email": userData.email,
            "Registration Number": userData.registrationNumber || 'Pending',
            "Contact Number": userData.contactNumber || 'Not provided',
            "Membership Status": "",
            "Status": userData.membershipStatus || 'Not registered',
            "Expiry Date": userData.membershipExpiry ? new Date(userData.membershipExpiry).toLocaleDateString() : 'Not available',
            "Outstanding Fines": `Rs. ${userData.fines || 0}`,
            "Generated on": new Date().toLocaleDateString()
        };

        return (
            <div className="bg-white p-4 rounded-lg border border-amber-200 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-center text-amber-700 mb-4 border-b pb-2">
                    Library Membership Card
                </h3>
                
                <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-2">
                        <h4 className="font-semibold text-amber-600 text-sm uppercase tracking-wide">Member Information</h4>
                        
                        <div className="flex justify-between items-center py-1 border-b">
                            <span className="text-sm text-gray-600">Name:</span>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{userData.name}</span>
                                <button 
                                    onClick={() => copyToClipboard(userData.name, 'name')}
                                    className="text-amber-600 hover:text-amber-700 transition-colors"
                                >
                                    {copiedField === 'name' ? <MdCheckCircle className="text-green-500" /> : <MdContentCopy className="text-sm" />}
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center py-1 border-b">
                            <span className="text-sm text-gray-600">Email:</span>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-xs">{userData.email}</span>
                                <button 
                                    onClick={() => copyToClipboard(userData.email, 'email')}
                                    className="text-amber-600 hover:text-amber-700 transition-colors"
                                >
                                    {copiedField === 'email' ? <MdCheckCircle className="text-green-500" /> : <MdContentCopy className="text-sm" />}
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center py-1 border-b">
                            <span className="text-sm text-gray-600">Registration:</span>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{userData.registrationNumber || 'Pending'}</span>
                                {userData.registrationNumber && (
                                    <button 
                                        onClick={() => copyToClipboard(userData.registrationNumber, 'registration')}
                                        className="text-amber-600 hover:text-amber-700 transition-colors"
                                    >
                                        {copiedField === 'registration' ? <MdCheckCircle className="text-green-500" /> : <MdContentCopy className="text-sm" />}
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center py-1 border-b">
                            <span className="text-sm text-gray-600">Contact:</span>
                            <span className="font-medium">{userData.contactNumber || 'Not provided'}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 pt-2">
                        <h4 className="font-semibold text-amber-600 text-sm uppercase tracking-wide">Membership Status</h4>
                        
                        <div className="flex justify-between items-center py-1 border-b">
                            <span className="text-sm text-gray-600">Status:</span>
                            {getMembershipBadge()}
                        </div>
                        
                        <div className="flex justify-between items-center py-1 border-b">
                            <span className="text-sm text-gray-600">Expiry:</span>
                            <span className="font-medium">
                                {userData.membershipExpiry 
                                    ? new Date(userData.membershipExpiry).toLocaleDateString() 
                                    : 'Not available'}
                            </span>
                        </div>
                        
                        <div className="flex justify-between items-center py-1">
                            <span className="text-sm text-gray-600">Fines:</span>
                            <span className={`font-medium ${userData.fines > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                Rs. {userData.fines || 0}
                            </span>
                        </div>
                    </div>

                    <div className="text-center pt-3 border-t">
                        <p className="text-xs text-gray-500">
                            Generated on {new Date().toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Library Management System
                        </p>
                    </div>
                </div>

                <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                    <p className="text-xs text-amber-700 text-center">
                        <strong>Tip:</strong> When scanned, this QR code will display your membership information in a clean, readable format.
                    </p>
                </div>
            </div>
        );
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const getRoleIcon = () => {
        const iconClass = "text-5xl p-3 rounded-full bg-opacity-20";
        switch(userData?.role) {
            case 'ADMIN':
                return <FaUserShield className={`${iconClass} bg-purple-600 text-purple-600`} />;
            default:
                return <FaUser className={`${iconClass} bg-amber-600 text-amber-600`} />;
        }
    };

    const getRoleBadge = () => {
        const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold shadow-sm";
        switch(userData?.role) {
            case 'ADMIN':
                return <span className={`${baseClasses} bg-purple-100 text-purple-800`}>ADMINISTRATOR</span>;
            default:
                return <span className={`${baseClasses} bg-amber-100 text-amber-800`}>MEMBER</span>;
        }
    };

    const getMembershipBadge = () => {
        const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold shadow-sm";
        switch(userData?.membershipStatus) {
            case 'ACTIVE':
                return <span className={`${baseClasses} bg-green-100 text-green-800`}>ACTIVE MEMBER</span>;
            case 'PENDING':
                return <span className={`${baseClasses} bg-amber-100 text-amber-800`}>PENDING APPROVAL</span>;
            case 'EXPIRED':
                return <span className={`${baseClasses} bg-red-100 text-red-800`}>MEMBERSHIP EXPIRED</span>;
            case 'SUSPENDED':
                return <span className={`${baseClasses} bg-red-100 text-red-800`}>SUSPENDED</span>;
            default:
                return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>NOT REGISTERED</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
                <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
                <div className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md mx-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">User Not Found</h2>
                    <p className="text-gray-600 mb-6">Unable to load user profile details.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition-all shadow-md"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-amber-600 to-amber-800 p-6 md:p-8 text-white relative">
                        {/* Action Buttons - Top Right */}
                        <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center space-x-2">
                            <button
                                onClick={handleEditToggle}
                                className="p-2 md:p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
                                title={isEditing ? "Cancel Editing" : "Edit Profile"}
                            >
                                {isEditing ? <MdCancel className="text-lg md:text-xl" /> : <MdModeEdit className="text-lg md:text-xl" />}
                            </button>
                            <button
                                onClick={showLogoutConfirmation}
                                className="p-2 md:p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
                                title="Logout"
                            >
                                <MdLogout className="text-lg md:text-xl" />
                            </button>
                        </div>
                        
                        {/* Profile Info Section */}
                        <div className="flex flex-col items-center space-y-6 md:flex-row md:space-y-0 md:space-x-8 md:items-start">
                            {/* Profile Picture */}
                            <div className="relative flex-shrink-0">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                                    <img 
                                        src={editData.profilePic || userData.profilePic || getDefaultProfilePic(userData.name)} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = getDefaultProfilePic(userData.name);
                                            e.target.onerror = null;
                                        }}
                                    />
                                    {isEditing && (
                                        <>
                                            <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                                                <MdCameraAlt className="text-xl md:text-2xl text-white" />
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    onChange={handleProfilePicUpload}
                                                    accept="image/*"
                                                    disabled={isUploading}
                                                />
                                            </label>
                                            {isUploading && (
                                                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-white"></div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                                {isEditing && (
                                    <p className="text-xs text-amber-100 text-center mt-2 max-w-[120px]">
                                        Click photo to change
                                    </p>
                                )}
                            </div>

                            {/* User Details */}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-2xl md:text-3xl font-bold mb-3">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.name || ''}
                                            onChange={(e) => handleEditChange('name', e.target.value)}
                                            className="bg-white bg-opacity-20 text-white border border-white border-opacity-30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white text-center md:text-left w-full max-w-xs"
                                            placeholder="Enter your name"
                                        />
                                    ) : (
                                        userData.name
                                    )}
                                </h1>

                                {/* Badges */}
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
                                    {getRoleBadge()}
                                    {getMembershipBadge()}
                                    {userData.registrationNumber && (
                                        <span className="px-3 py-1 bg-white bg-opacity-20 text-white rounded-full text-xs font-medium flex items-center">
                                            <FaIdCard className="mr-1" />
                                            {userData.registrationNumber}
                                        </span>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="flex items-center justify-center md:justify-start text-amber-100">
                                    <FaEnvelope className="mr-2 flex-shrink-0" />
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={editData.email || ''}
                                            onChange={(e) => handleEditChange('email', e.target.value)}
                                            className="bg-white bg-opacity-20 text-white border border-white border-opacity-30 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white flex-1 max-w-xs"
                                            placeholder="Enter your email"
                                        />
                                    ) : (
                                        <span className="break-all">{userData.email}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Edit Actions */}
                        {isEditing && (
                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving || isUploading}
                                    className="w-full sm:w-auto bg-white text-amber-700 px-6 py-3 rounded-lg font-medium hover:bg-amber-50 transition-all disabled:opacity-50 flex items-center justify-center"
                                >
                                    <MdSave className="mr-2" />
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    onClick={handleEditToggle}
                                    className="w-full sm:w-auto bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-30 transition-all flex items-center justify-center"
                                >
                                    <MdCancel className="mr-2" />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Navigation Tabs */}
                    <div className="bg-white border-b">
                        <div className="flex overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('personal')}
                                className={`px-6 py-4 font-medium flex items-center justify-center space-x-2 whitespace-nowrap ${activeTab === 'personal' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <MdPerson className="text-lg" />
                                <span>Personal</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('membership')}
                                className={`px-6 py-4 font-medium flex items-center justify-center space-x-2 whitespace-nowrap ${activeTab === 'membership' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <MdPayment className="text-lg" />
                                <span>Membership</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('fines')}
                                className={`px-6 py-4 font-medium flex items-center justify-center space-x-2 whitespace-nowrap ${activeTab === 'fines' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <MdHistory className="text-lg" />
                                <span>Fines & History</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            {activeTab === 'personal' && (
                                <div className="p-4 md:p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                        <MdPerson className="mr-2 text-amber-600" />
                                        Personal Information
                                    </h2>
                                    
                                    {/* Basic Details Section */}
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="bg-amber-50 p-4 md:p-5 rounded-xl border border-amber-200">
                                            <h3 className="text-sm font-medium text-amber-700 mb-4 text-center md:text-left">BASIC DETAILS</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="text-center md:text-left">
                                                    <p className="text-xs text-amber-600 mb-1">Full Name</p>
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            value={editData.name || ''}
                                                            onChange={(e) => handleEditChange('name', e.target.value)}
                                                            className="w-full p-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                                        />
                                                    ) : (
                                                        <p className="font-medium text-gray-800 break-words">{userData.name}</p>
                                                    )}
                                                </div>
                                                
                                                <div className="text-center md:text-left">
                                                    <p className="text-xs text-amber-600 mb-1">Email Address</p>
                                                    {isEditing ? (
                                                        <input
                                                            type="email"
                                                            value={editData.email || ''}
                                                            onChange={(e) => handleEditChange('email', e.target.value)}
                                                            className="w-full p-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                                        />
                                                    ) : (
                                                        <p className="font-medium text-gray-800 break-all">{userData.email}</p>
                                                    )}
                                                </div>
                                                
                                                <div className="text-center md:text-left">
                                                    <p className="text-xs text-amber-600 mb-1">Contact Number</p>
                                                    {isEditing ? (
                                                        <input
                                                            type="tel"
                                                            value={editData.contactNumber || ''}
                                                            onChange={(e) => handleEditChange('contactNumber', e.target.value)}
                                                            className="w-full p-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                                            placeholder="Enter contact number"
                                                        />
                                                    ) : (
                                                        <p className="font-medium text-gray-800">
                                                            {userData.contactNumber || 'Not provided'}
                                                        </p>
                                                    )}
                                                </div>
                                                
                                                <div className="text-center md:text-left">
                                                    <p className="text-xs text-amber-600 mb-1">Registration Number</p>
                                                    <p className="font-medium text-gray-800">
                                                        {userData.registrationNumber || 'Pending'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Address Section */}
                                        <div className="bg-amber-50 p-4 md:p-5 rounded-xl border border-amber-200">
                                            <h3 className="text-sm font-medium text-amber-700 mb-4 text-center md:text-left">ADDRESS</h3>
                                            <div className="text-center md:text-left">
                                                <p className="text-xs text-amber-600 mb-1">Full Address</p>
                                                {isEditing ? (
                                                    <textarea
                                                        value={editData.address || ''}
                                                        onChange={(e) => handleEditChange('address', e.target.value)}
                                                        className="w-full p-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                                        rows="3"
                                                        placeholder="Enter your address"
                                                    />
                                                ) : (
                                                    <p className="font-medium text-gray-800">
                                                        {userData.address || 'Not provided'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'membership' && (
                                <div className="p-4 md:p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                        <MdPayment className="mr-2 text-amber-600" />
                                        Membership Information
                                    </h2>
                                    
                                    <div className="grid grid-cols-1 gap-6">
                                        {/* Membership Status */}
                                        <div className="bg-amber-50 p-4 md:p-5 rounded-xl border border-amber-200">
                                            <h3 className="text-sm font-medium text-amber-700 mb-4 text-center md:text-left">MEMBERSHIP STATUS</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="text-center md:text-left">
                                                    <p className="text-xs text-amber-600 mb-1">Current Status</p>
                                                    <div className="flex justify-center md:justify-start">
                                                        {getMembershipBadge()}
                                                    </div>
                                                    {userData.membershipPayment?.slipImage && (
                                                        <p className="text-xs text-green-600 mt-2">
                                                            Payment slip uploaded: {new Date(userData.membershipPayment.uploadedAt).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                                
                                                <div className="text-center md:text-left">
                                                    <p className="text-xs text-amber-600 mb-1">Expiry Date</p>
                                                    <p className="font-medium text-gray-800">
                                                        {userData.membershipExpiry 
                                                            ? new Date(userData.membershipExpiry).toLocaleDateString() 
                                                            : 'Not available'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment Slip Upload */}
                                        {(userData.membershipStatus === 'PENDING' || !userData.membershipPayment?.slipImage) && (
                                            <div className="bg-amber-50 p-4 md:p-5 rounded-xl border border-amber-200">
                                                <h3 className="text-sm font-medium text-amber-700 mb-4 text-center md:text-left">UPLOAD PAYMENT SLIP</h3>
                                                <form onSubmit={handleMembershipSlipUpload} className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-amber-700 mb-2">
                                                            Payment Slip (Image)
                                                        </label>
                                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-amber-300 rounded-xl cursor-pointer bg-amber-100 hover:bg-amber-200 transition-colors">
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <MdPayment className="w-8 h-8 text-amber-500 mb-2" />
                                                                <p className="text-xs text-amber-600 text-center px-2">
                                                                    {membershipSlip ? membershipSlip.name : "Click to upload payment slip"}
                                                                </p>
                                                            </div>
                                                            <input 
                                                                type="file" 
                                                                onChange={(e) => setMembershipSlip(e.target.files[0])}
                                                                accept="image/*"
                                                                required
                                                                className="hidden" 
                                                            />
                                                        </label>
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        disabled={isUploading || !membershipSlip}
                                                        className="w-full bg-amber-600 text-white py-2 rounded-lg font-medium hover:bg-amber-700 transition-all disabled:opacity-50 flex items-center justify-center"
                                                    >
                                                        <MdSave className="mr-2" />
                                                        {isUploading ? 'Uploading...' : 'Submit Payment Slip'}
                                                    </button>
                                                </form>
                                            </div>
                                        )}

                                        {/* Show uploaded slip if exists */}
                                        {userData.membershipPayment?.slipImage && (
                                            <div className="bg-amber-50 p-4 md:p-5 rounded-xl border border-amber-200">
                                                <h3 className="text-sm font-medium text-amber-700 mb-4 text-center md:text-left">UPLOADED PAYMENT SLIP</h3>
                                                <div className="flex flex-col items-center space-y-4">
                                                    <img 
                                                        src={`http://localhost:8000${userData.membershipPayment.slipImage}`}
                                                        alt="Payment slip"
                                                        className="max-w-xs w-full h-auto border rounded-lg shadow-sm cursor-pointer"
                                                        onClick={() => window.open(`http://localhost:8000${userData.membershipPayment.slipImage}`, '_blank')}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'block';
                                                        }}
                                                    />
                                                    <div className="hidden text-center p-8 bg-gray-100 rounded-lg">
                                                        <p className="text-gray-500">Image not available</p>
                                                        <p className="text-xs text-gray-400 mt-1">Path: {userData.membershipPayment.slipImage}</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-xs text-amber-600">
                                                            Uploaded: {new Date(userData.membershipPayment.uploadedAt).toLocaleString()}
                                                        </p>
                                                        <p className="text-xs text-blue-500 mt-1">Click image to view full size</p>
                                                        {userData.membershipStatus === 'PENDING' && (
                                                            <p className="text-sm text-amber-600 mt-2 font-medium">
                                                                Waiting for admin approval...
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* QR Code Section - UPDATED */}
                                        {userData.membershipStatus === 'ACTIVE' && (
                                            <div className="bg-amber-50 p-4 md:p-5 rounded-xl border border-amber-200">
                                                <h3 className="text-sm font-medium text-amber-700 mb-4 text-center md:text-left">MEMBERSHIP CARD</h3>
                                                <div className="flex flex-col items-center">
                                                    <div className="bg-white p-4 rounded-xl shadow-md border border-amber-200">
                                                        <div className="flex justify-center mb-4">
                                                            <div 
                                                                className="cursor-pointer"
                                                                onClick={() => setShowQRCode(!showQRCode)}
                                                            >
                                                                {showQRCode ? (
                                                                    <QRCodeSVG 
                                                                        value={generateQRData()} 
                                                                        size={128}
                                                                        level="H"
                                                                        includeMargin
                                                                    />
                                                                ) : (
                                                                    <div className="w-32 h-32 bg-amber-100 flex items-center justify-center rounded border border-amber-200">
                                                                        <MdQrCode className="text-4xl text-amber-600" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-amber-600 text-center mt-2">
                                                            {showQRCode 
                                                                ? 'Scan this QR code for your membership details' 
                                                                : 'Click to show QR code'}
                                                        </p>
                                                    </div>
                                                    
                                                
                                                    
                                                    <button
                                                        onClick={() => setShowQRCode(!showQRCode)}
                                                        className="mt-4 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700 transition-colors flex items-center"
                                                    >
                                                        <MdQrCode className="mr-2" />
                                                        {showQRCode ? 'Hide QR Code' : 'Show QR Code'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'fines' && (
                                <div className="p-4 md:p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                        <MdHistory className="mr-2 text-amber-600" />
                                        Fines & History
                                    </h2>
                                    
                                    <div className="grid grid-cols-1 gap-6">
                                        {/* Fines Overview */}
                                        <div className="bg-amber-50 p-4 md:p-5 rounded-xl border border-amber-200">
                                            <h3 className="text-sm font-medium text-amber-700 mb-4 text-center md:text-left">FINES OVERVIEW</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="text-center md:text-left">
                                                    <p className="text-xs text-amber-600 mb-1">Outstanding Fines</p>
                                                    <p className="font-medium text-2xl text-gray-800">
                                                        Rs. {userData.fines || 0}
                                                    </p>
                                                </div>
                                                
                                                <div className="text-center md:text-left">
                                                    <p className="text-xs text-amber-600 mb-1">Fine Rate</p>
                                                    <p className="font-medium text-gray-800">
                                                        Rs. 1 per day
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {userData.fines > 0 && (
                                                <div className="mt-4">
                                                    <button className="w-full bg-amber-600 text-white py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors">
                                                        Pay Fines Now
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Reservation History */}
                                        <div className="bg-amber-50 p-4 md:p-5 rounded-xl border border-amber-200">
                                            <h3 className="text-sm font-medium text-amber-700 mb-4 text-center md:text-left">RESERVATION HISTORY</h3>
                                            <p className="text-gray-600 text-center">
                                                Your reservation history will appear here once you start borrowing books.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="p-4 md:p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center md:justify-start">
                                    <MdInfo className="mr-2 text-amber-600" />
                                    Quick Actions
                                </h2>
                                <div className="space-y-3">
                                    <button 
                                        onClick={handleEditToggle}
                                        className="w-full text-left p-3 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors flex items-center justify-center md:justify-start"
                                    >
                                        <MdModeEdit className="mr-2" />
                                        {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                                    </button>
                                    <button 
                                        className="w-full text-left p-3 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors flex items-center justify-center md:justify-start"
                                        onClick={() => document.getElementById('changePasswordModal').showModal()}
                                    >
                                        <MdSecurity className="mr-2" />
                                        Change Password
                                    </button>
                                    {userData.membershipStatus === 'ACTIVE' && (
                                        <button 
                                            className="w-full text-left p-3 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors flex items-center justify-center md:justify-start"
                                            onClick={() => setShowQRCode(!showQRCode)}
                                        >
                                            <MdQrCode className="mr-2" />
                                            {showQRCode ? 'Hide QR Code' : 'Show QR Code'}
                                        </button>
                                    )}
                                    <button 
                                        className="w-full text-left p-3 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors flex items-center justify-center md:justify-start"
                                        onClick={showLogoutConfirmation}
                                    >
                                        <MdLogout className="mr-2" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Membership Status Card */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="p-4 md:p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center md:justify-start">
                                    <MdPayment className="mr-2 text-amber-600" />
                                    Membership Status
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Status:</span>
                                        {getMembershipBadge()}
                                    </div>
                                    {userData.membershipExpiry && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Expiry:</span>
                                            <span className="font-medium">
                                                {new Date(userData.membershipExpiry).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                    {userData.fines > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Fines:</span>
                                            <span className="font-medium text-red-600">
                                                Rs. {userData.fines}
                                            </span>
                                        </div>
                                    )}
                                    {userData.membershipPayment?.slipImage && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Payment:</span>
                                            <span className="font-medium text-green-600">
                                                Uploaded
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <dialog id="changePasswordModal" className="modal">
                <div className="modal-box max-w-md mx-4">
                    <ChangePassword 
                        onClose={() => document.getElementById('changePasswordModal').close()}
                        onSuccess={() => {
                            document.getElementById('changePasswordModal').close();
                            fetchUserDetails();
                        }}
                    />
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default Profile;