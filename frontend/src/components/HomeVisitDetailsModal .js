import React from "react";
import { IoClose } from "react-icons/io5";

const HomeVisitDetailsModal = ({ appointment, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
                {/* 🔹 Close Button */}
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
                    onClick={onClose}
                >
                    <IoClose size={24} />
                </button>

                {/* 🏥 Appointment Details */}
                <h2 className="text-xl font-bold text-gray-700 mb-2">
                    Home Visit Details
                </h2>

                <p className="text-gray-600">
                    <strong>Patient Name:</strong> {appointment.patientName}
                </p>
                <p className="text-gray-600">
                    <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                    <strong>Time:</strong> {appointment.time}
                </p>
                <p className="text-gray-600">
                    <strong>Address:</strong> {appointment.address}
                </p>
                <p className="text-gray-600">
                    <strong>Doctor:</strong> {appointment.doctorName}
                </p>
                <p className="text-gray-600">
                    <strong>Reason:</strong> {appointment.reason}
                </p>

                {/* ✅ Close Button */}
                <button
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default HomeVisitDetailsModal;