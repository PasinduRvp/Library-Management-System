import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdModeEdit, MdLogout, MdSecurity, MdPerson, MdInfo, MdSchool, MdMedicalServices } from 'react-icons/md';
import { FaUserShield, FaUserMd, FaUserGraduate, FaUserNurse, FaFlask, FaPills, FaUser, FaQrcode } from 'react-icons/fa';
import SummaryApi from '../common';
import ChangePassword from '../components/ChangePassword';
import UpdateProfile from '../components/UpdateProfile';
import QRCode from 'qrcode.react';
import { QRCodeSVG } from 'qrcode.react';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('personal');
    const [qrCodeData, setQrCodeData] = useState('');
    const navigate = useNavigate();

    const fetchUserDetails = async () => {
        try {
            const response = await fetch(SummaryApi.current_user.url, {
                method: SummaryApi.current_user.method,
                credentials: 'include'
            });
            const dataResponse = await response.json();

            if (dataResponse.success) {
                setUserData(dataResponse.data);
                // Generate QR code data URL for the patient
                const patientUrl = `${window.location.origin}/patient/${dataResponse.data._id}`;
                setQrCodeData(patientUrl);
            } else {
                toast.error(dataResponse.message);
                navigate('/login');
            }
        } catch (error) {
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

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const getRoleIcon = () => {
        const iconClass = "text-5xl p-3 rounded-full bg-opacity-20";
        switch(userData?.role) {
            case 'ADMIN':
                return <FaUserShield className={`${iconClass} bg-purple-600 text-purple-600`} />;
            case 'DOCTOR':
                return <FaUserMd className={`${iconClass} bg-blue-600 text-blue-600`} />;
            case 'STUDENT':
                return <FaUserGraduate className={`${iconClass} bg-green-600 text-green-600`} />;
            case 'NURSE':
                return <FaUserNurse className={`${iconClass} bg-pink-600 text-pink-600`} />;
            case 'PHARMACY':
                return <FaPills className={`${iconClass} bg-yellow-600 text-yellow-600`} />;
            case 'LABORATORY':
                return <FaFlask className={`${iconClass} bg-red-600 text-red-600`} />;
            default:
                return <FaUser className={`${iconClass} bg-gray-600 text-gray-600`} />;
        }
    };

    const getRoleBadge = () => {
        const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold shadow-sm";
        switch(userData?.role) {
            case 'ADMIN':
                return <span className={`${baseClasses} bg-purple-100 text-purple-800`}>ADMINISTRATOR</span>;
            case 'DOCTOR':
                return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>DOCTOR</span>;
            case 'STUDENT':
                return <span className={`${baseClasses} bg-green-100 text-green-800`}>MEDICAL STUDENT</span>;
            case 'NURSE':
                return <span className={`${baseClasses} bg-pink-100 text-pink-800`}>NURSE</span>;
            case 'PHARMACY':
                return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>PHARMACIST</span>;
            case 'LABORATORY':
                return <span className={`${baseClasses} bg-red-100 text-red-800`}>LAB TECHNICIAN</span>;
            default:
                return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>STAFF MEMBER</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
                <div className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md mx-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">User Not Found</h2>
                    <p className="text-gray-600 mb-6">Unable to load user profile details.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all shadow-md"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 md:p-8 text-white relative">
                        <div className="absolute top-6 right-6 flex space-x-3">
                            <button
                                onClick={() => setActiveTab('personal')}
                                className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
                                title="Edit Profile"
                            >
                                <MdModeEdit className="text-xl" />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
                                title="Logout"
                            >
                                <MdLogout className="text-xl" />
                            </button>
                        </div>
                        
                        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                                    {userData.profilePic ? (
                                        <img 
                                            src={userData.profilePic} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-gray-300">
                                            {getRoleIcon()}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl font-bold mb-2">{userData.name}</h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                    {getRoleBadge()}
                                    {userData.indexNumber && (
                                        <span className="px-3 py-1 bg-white bg-opacity-20 text-white rounded-full text-xs font-medium">
                                            ID: {userData.indexNumber}
                                        </span>
                                    )}
                                </div>
                                <p className="mt-3 text-blue-100">{userData.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="bg-white border-b">
                        <div className="flex overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('personal')}
                                className={`px-6 py-4 font-medium flex items-center space-x-2 ${activeTab === 'personal' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <MdPerson className="text-lg" />
                                <span>Personal</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`px-6 py-4 font-medium flex items-center space-x-2 ${activeTab === 'security' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <MdSecurity className="text-lg" />
                                <span>Security</span>
                            </button>
                            {userData.role === 'STUDENT' && (
                                <button
                                    onClick={() => setActiveTab('academic')}
                                    className={`px-6 py-4 font-medium flex items-center space-x-2 ${activeTab === 'academic' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <MdSchool className="text-lg" />
                                    <span>Academic</span>
                                </button>
                            )}
                            {['DOCTOR', 'NURSE', 'PHARMACY', 'LABORATORY'].includes(userData.role) && (
                                <button
                                    onClick={() => setActiveTab('professional')}
                                    className={`px-6 py-4 font-medium flex items-center space-x-2 ${activeTab === 'professional' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <MdMedicalServices className="text-lg" />
                                    <span>Professional</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            {activeTab === 'personal' && (
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                        <MdPerson className="mr-2 text-blue-600" />
                                        Personal Information
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 p-5 rounded-xl">
                                            <h3 className="text-sm font-medium text-gray-500 mb-3">BASIC DETAILS</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-xs text-gray-400">Full Name</p>
                                                    <p className="font-medium text-gray-800">{userData.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400">Email Address</p>
                                                    <p className="font-medium text-gray-800">{userData.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-5 rounded-xl">
                                            <h3 className="text-sm font-medium text-gray-500 mb-3">ACCOUNT INFORMATION</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-xs text-gray-400">Account Created</p>
                                                    <p className="font-medium text-gray-800">
                                                        {new Date(userData.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400">Last Active</p>
                                                    <p className="font-medium text-gray-800">
                                                        {new Date().toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                        <MdSecurity className="mr-2 text-blue-600" />
                                        Account Security
                                    </h2>
                                    <div className="bg-gray-50 p-5 rounded-xl">
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500 mb-2">PASSWORD</h3>
                                                <p className="text-gray-800 mb-4">Last changed 3 months ago</p>
                                                <button
                                                    onClick={() => document.getElementById('changePasswordModal').showModal()}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-sm"
                                                >
                                                    Change Password
                                                </button>
                                            </div>
                                            <div className="border-t pt-4">
                                                <h3 className="text-sm font-medium text-gray-500 mb-2">ACCOUNT ACTIVITY</h3>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="font-medium text-gray-800">Login from Chrome</p>
                                                            <p className="text-xs text-gray-500">Today at 10:30 AM</p>
                                                        </div>
                                                        <span className="text-green-500 text-xs font-medium">ACTIVE NOW</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="font-medium text-gray-800">Login from Safari</p>
                                                            <p className="text-xs text-gray-500">Yesterday at 8:45 PM</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'academic' && userData.role === 'STUDENT' && (
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                        <MdSchool className="mr-2 text-blue-600" />
                                        Academic Information
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 p-5 rounded-xl">
                                            <h3 className="text-sm font-medium text-gray-500 mb-3">ACADEMIC DETAILS</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-xs text-gray-400">Index Number</p>
                                                    <p className="font-medium text-gray-800">{userData.indexNumber}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400">Batch</p>
                                                    <p className="font-medium text-gray-800">2023/2024</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400">Faculty</p>
                                                    <p className="font-medium text-gray-800">Medicine</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-5 rounded-xl">
                                            <h3 className="text-sm font-medium text-gray-500 mb-3">CURRENT SEMESTER</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-xs text-gray-400">Semester</p>
                                                    <p className="font-medium text-gray-800">2nd Year - 1st Semester</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400">GPA</p>
                                                    <p className="font-medium text-gray-800">3.75</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400">Class Rank</p>
                                                    <p className="font-medium text-gray-800">15/120</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'professional' && ['DOCTOR', 'NURSE', 'PHARMACY', 'LABORATORY'].includes(userData.role) && (
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                        <MdMedicalServices className="mr-2 text-blue-600" />
                                        Professional Information
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 p-5 rounded-xl">
                                            <h3 className="text-sm font-medium text-gray-500 mb-3">PROFESSIONAL DETAILS</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-xs text-gray-400">Department</p>
                                                    <p className="font-medium text-gray-800">
                                                        {userData.role === 'DOCTOR' ? 'Cardiology' : 
                                                         userData.role === 'NURSE' ? 'Emergency' :
                                                         userData.role === 'PHARMACY' ? 'Pharmacy' : 'Laboratory'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400">Employee ID</p>
                                                    <p className="font-medium text-gray-800">
                                                        {userData.role === 'DOCTOR' ? 'DOC-' + userData.indexNumber : 
                                                         userData.role === 'NURSE' ? 'NUR-' + userData.indexNumber :
                                                         userData.role === 'PHARMACY' ? 'PHA-' + userData.indexNumber : 'LAB-' + userData.indexNumber}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400">Years of Service</p>
                                                    <p className="font-medium text-gray-800">
                                                        {userData.role === 'DOCTOR' ? '5 years' : 
                                                         userData.role === 'NURSE' ? '3 years' :
                                                         userData.role === 'PHARMACY' ? '2 years' : '1 year'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-5 rounded-xl">
                                            <h3 className="text-sm font-medium text-gray-500 mb-3">QUALIFICATIONS</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-xs text-gray-400">Specialization</p>
                                                    <p className="font-medium text-gray-800">
                                                        {userData.role === 'DOCTOR' ? 'Cardiologist' : 
                                                         userData.role === 'NURSE' ? 'Registered Nurse' :
                                                         userData.role === 'PHARMACY' ? 'Clinical Pharmacist' : 'Medical Lab Scientist'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400">License Number</p>
                                                    <p className="font-medium text-gray-800">
                                                        {userData.role === 'DOCTOR' ? 'SLMC-' + Math.floor(100000 + Math.random() * 900000) : 
                                                         userData.role === 'NURSE' ? 'SNC-' + Math.floor(100000 + Math.random() * 900000) :
                                                         userData.role === 'PHARMACY' ? 'SPC-' + Math.floor(100000 + Math.random() * 900000) : 'SMLS-' + Math.floor(100000 + Math.random() * 900000)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <MdInfo className="mr-2 text-blue-600" />
                                    Quick Actions
                                </h2>
                                <div className="space-y-3">
                                    <button className="w-full text-left p-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center">
                                        <MdModeEdit className="mr-2" />
                                        Update Profile
                                    </button>
                                    <button 
                                        className="w-full text-left p-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center"
                                        onClick={() => document.getElementById('changePasswordModal').showModal()}
                                    >
                                        <MdSecurity className="mr-2" />
                                        Change Password
                                    </button>
                                    {userData.role === 'STUDENT' && (
                                        <button className="w-full text-left p-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center">
                                            <MdSchool className="mr-2" />
                                            View Academic Records
                                        </button>
                                    )}
                                    {['DOCTOR', 'NURSE'].includes(userData.role) && (
                                        <button className="w-full text-left p-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center">
                                            <MdMedicalServices className="mr-2" />
                                            View Schedule
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* QR Code Section */}
                        {userData.role === 'STUDENT' && qrCodeData && (
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                <div className="p-6">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <FaQrcode className="mr-2 text-blue-600" />
                                        Medical QR Code
                                    </h2>
                                    <div className="flex flex-col items-center">
                                        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-3">
                                            <QRCodeSVG
                                                value={qrCodeData}
                                                size={180}
                                                level="H"
                                                includeMargin={true}
/>
                                        </div>
                                        <p className="text-sm text-gray-500 text-center">
                                            Scan this code to access your medical records
                                        </p>
                                        <button 
                                            onClick={() => {
                                                // Create a temporary link to download the QR code
                                                const canvas = document.querySelector("canvas");
                                                const pngUrl = canvas
                                                    .toDataURL("image/png")
                                                    .replace("image/png", "image/octet-stream");
                                                const downloadLink = document.createElement("a");
                                                downloadLink.href = pngUrl;
                                                downloadLink.download = `${userData.name}-medical-qr.png`;
                                                document.body.appendChild(downloadLink);
                                                downloadLink.click();
                                                document.body.removeChild(downloadLink);
                                            }}
                                            className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            Download QR Code
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">System Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-400">Last System Update</p>
                                        <p className="font-medium text-gray-800">Version 2.3.1 (May 2023)</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Next Maintenance</p>
                                        <p className="font-medium text-gray-800">June 15, 2023 (2:00 AM - 4:00 AM)</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Support Contact</p>
                                        <p className="font-medium text-gray-800">support@prabodhahealth.lk</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <dialog id="changePasswordModal" className="modal">
                <div className="modal-box max-w-md">
                    <ChangePassword 
                        onClose={() => document.getElementById('changePasswordModal').close()}
                        onSuccess={handleLogout}
                    />
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            <UpdateProfile 
                userData={userData}
                onClose={() => {
                    fetchUserDetails();
                }}
            />
        </div>
    );
};

export default Profile;