import React, { useState, useEffect } from 'react'
import ROLE from '../common/role'
import { IoMdClose } from "react-icons/io";
import { FaGraduationCap, FaCalendarAlt } from "react-icons/fa";
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const ChangeUserRole = ({
    name,
    email,
    role,
    userId,
    indexNumber: currentIndexNumber,
    year: currentYear,
    semester: currentSemester,
    onClose,
    callFunc,
}) => {
    const [userRole, setUserRole] = useState(role);
    const [indexNumber, setIndexNumber] = useState(currentIndexNumber || '');
    const [year, setYear] = useState(currentYear || '');
    const [semester, setSemester] = useState(currentSemester || '');
    const [isCheckingIndex, setIsCheckingIndex] = useState(false);
    const [indexNumberExists, setIndexNumberExists] = useState(false);

    const years = ['Y1', 'Y2', 'Y3'];
    const semesters = ['S1', 'S2'];

    const checkIndexNumberExists = async (indexNumber) => {
        if (!indexNumber || userRole !== ROLE.STUDENT) return false;
        
        try {
            setIsCheckingIndex(true);
            const response = await fetch(`${SummaryApi.checkIndexNumber.url}?indexNumber=${indexNumber}&userId=${userId}`);
            const result = await response.json();
            
            if (response.ok) {
                setIndexNumberExists(result.exists);
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

    const handleOnChangeSelect = (e) => {
        const newRole = e.target.value;
        setUserRole(newRole);
        
        // Reset student-specific fields if role is changed from STUDENT
        if (newRole !== ROLE.STUDENT) {
            setIndexNumber('');
            setYear('');
            setSemester('');
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (userRole === ROLE.STUDENT && indexNumber) {
                checkIndexNumberExists(indexNumber);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [indexNumber, userRole]);

    const validateForm = () => {
        if (userRole === ROLE.STUDENT) {
            if (!indexNumber) {
                toast.error("Index number is required for students");
                return false;
            }
            if (indexNumberExists) {
                toast.error("This index number is already in use");
                return false;
            }
            if (!year) {
                toast.error("Year is required for students");
                return false;
            }
            if (!semester) {
                toast.error("Semester is required for students");
                return false;
            }
        }
        return true;
    };

    const updateUserRole = async() => {
        if (!validateForm()) {
            return;
        }

        const payload = {
            userId: userId,
            role: userRole,
            ...(userRole === ROLE.STUDENT && {
                indexNumber,
                year,
                semester
            })
        };

        // Clear student fields if role is not STUDENT
        if (userRole !== ROLE.STUDENT) {
            payload.indexNumber = undefined;
            payload.year = undefined;
            payload.semester = undefined;
        }

        const fetchResponse = await fetch(SummaryApi.updateUser.url, {
            method: SummaryApi.updateUser.method,
            credentials: 'include',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const responseData = await fetchResponse.json();

        if (responseData.success) {
            toast.success(responseData.message);
            onClose();
            callFunc();
        } else {
            toast.error(responseData.message || "Failed to update user");
        }
    };

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 w-full h-full z-10 flex justify-between items-center bg-slate-200 bg-opacity-50'>
            <div className='mx-auto bg-white shadow-md p-4 w-full max-w-sm'>

                <button className='block ml-auto' onClick={onClose}>
                    <IoMdClose/>
                </button>

                <h1 className='pb-4 text-lg font-medium'>Change User Role</h1>

                <p>Name: {name}</p>
                <p>Email: {email}</p>
                
                <div className='flex items-center justify-between my-4'>
                    <p>ROLE:</p>
                    <select 
                        className='border px-4 py-1' 
                        value={userRole} 
                        onChange={handleOnChangeSelect}
                    >
                        {Object.values(ROLE).map(el => (
                            <option value={el} key={el}>{el}</option>
                        ))}
                    </select>
                </div>

                {/* Student-specific fields */}
                {userRole === ROLE.STUDENT && (
                    <>
                        <div className='flex items-center justify-between my-4'>
                            <div className='flex items-center'>
                                <FaGraduationCap className='mr-2' />
                                <p>Index Number:</p>
                            </div>
                            <div className='relative'>
                                <input
                                    type="text"
                                    className='border px-4 py-1'
                                    value={indexNumber}
                                    onChange={(e) => setIndexNumber(e.target.value)}
                                    placeholder="Enter index number"
                                />
                                {isCheckingIndex && (
                                    <div className="absolute right-2 top-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {indexNumberExists && (
                            <p className="text-red-500 text-sm mb-2">This index number is already in use</p>
                        )}

                        <div className='flex items-center justify-between my-4'>
                            <div className='flex items-center'>
                                <FaCalendarAlt className='mr-2' />
                                <p>Year:</p>
                            </div>
                            <select
                                className='border px-4 py-1'
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                            >
                                <option value="">Select Year</option>
                                {years.map(y => (
                                    <option value={y} key={y}>{y}</option>
                                ))}
                            </select>
                        </div>

                        <div className='flex items-center justify-between my-4'>
                            <div className='flex items-center'>
                                <FaCalendarAlt className='mr-2' />
                                <p>Semester:</p>
                            </div>
                            <select
                                className='border px-4 py-1'
                                value={semester}
                                onChange={(e) => setSemester(e.target.value)}
                            >
                                <option value="">Select Semester</option>
                                {semesters.map(s => (
                                    <option value={s} key={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                <button 
                    className='w-fit mx-auto block border py-1 px-3 rounded-full bg-red-600 text-white hover:bg-red-800' 
                    onClick={updateUserRole}
                    disabled={isCheckingIndex}
                >
                    Change Role
                </button>
            </div>
        </div>
    );
};

export default ChangeUserRole;