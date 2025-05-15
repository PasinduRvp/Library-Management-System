import React, { useState } from 'react';
import { IoClose, IoSave } from "react-icons/io5";
import { FaUserMd, FaCalendarAlt, FaUser, FaPhone, FaEnvelope, FaStickyNote } from 'react-icons/fa';
import doctorsList from '../helpers/doctorsList';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const AddChannelingAppointment = ({ onClose, fetchData, showSuccessToast }) => {
  const [data, setData] = useState({
    doctorName: "",
    date: "",
    patientName: "",
    contactNo: "",
    email: "",
    otherNotes: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation checks
    if (data.contactNo.length !== 10) {
      toast.error("Contact number must be exactly 10 digits");
      setIsSubmitting(false);
      return;
    }

    try {
      // Additional validation for date
      const selectedDate = new Date(data.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        toast.error("Please select a date that is today or later");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(SummaryApi.AddChannelingAppointment.url, {
        method: SummaryApi.AddChannelingAppointment.method,
        credentials: 'include',
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();

      if(responseData.success) {
        showSuccessToast(responseData.message);
        onClose();
        fetchData();
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error("An error occurred while creating the appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center border-b p-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaUserMd className="mr-3 text-blue-500" />
              Add Channeling Appointment
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-red-600 transition-colors p-1"
              disabled={isSubmitting}
            >
              <IoClose className="text-2xl" />
            </button>
          </div>

          {/* Main Content with scrolling */}
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Doctor Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <FaUserMd className="mr-2 text-blue-500" />
                    Doctor
                  </label>
                  <select
                    name="doctorName"
                    value={data.doctorName}
                    onChange={handleOnChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select a doctor</option>
                    {doctorsList.map((doctor) => (
                      <option key={doctor.value} value={doctor.value}>
                        {doctor.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Appointment Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <FaCalendarAlt className="mr-2 text-blue-500" />
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={data.date}
                    onChange={handleOnChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min={new Date().toISOString().split('T')[0]}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Patient Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <FaUser className="mr-2 text-blue-500" />
                    Patient Name
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={data.patientName}
                    onChange={handleOnChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Contact Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <FaPhone className="mr-2 text-blue-500" />
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactNo"
                    value={data.contactNo}
                    onChange={handleOnChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    maxLength={10}
                    pattern="[0-9]{10}"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <FaEnvelope className="mr-2 text-blue-500" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleOnChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Notes (Full width) */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <FaStickyNote className="mr-2 text-blue-500" />
                    Additional Notes
                  </label>
                  <textarea
                    name="otherNotes"
                    value={data.otherNotes}
                    onChange={handleOnChange}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any special requirements or notes..."
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Fixed Footer with buttons */}
          <div className="border-t p-6 bg-white sticky bottom-0">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                disabled={isSubmitting}
              >
                <IoSave className="mr-2" />
                {isSubmitting ? 'Creating...' : 'Create Appointment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddChannelingAppointment;