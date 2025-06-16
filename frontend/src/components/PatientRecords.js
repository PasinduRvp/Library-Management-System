import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import { FaUser, FaNotesMedical, FaPills, FaFileMedical } from 'react-icons/fa';

const PatientRecords = ({ patientId }) => {
    const [patient, setPatient] = useState(null);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        diagnosis: '',
        treatment: '',
        prescription: '',
        notes: ''
    });

    const fetchPatientData = async () => {
        try {
            setLoading(true);
            const [patientResponse, recordsResponse] = await Promise.all([
                fetch(SummaryApi.getUserById.url(patientId), {
                    credentials: 'include'
                }),
                fetch(SummaryApi.getMedicalRecords.url(patientId), {
                    credentials: 'include'
                })
            ]);

            const patientData = await patientResponse.json();
            const recordsData = await recordsResponse.json();

            if (patientData.success) setPatient(patientData.data);
            if (recordsData.success) setRecords(recordsData.data);

            if (!patientData.success || !recordsData.success) {
                throw new Error(patientData.message || recordsData.message || 'Failed to fetch data');
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(SummaryApi.updateMedicalRecords.url(patientId), {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Medical record updated successfully");
                setFormData({
                    diagnosis: '',
                    treatment: '',
                    prescription: '',
                    notes: ''
                });
                fetchPatientData();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (patientId) {
            fetchPatientData();
        }
    }, [patientId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No patient data found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Patient Info */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <FaUser className="text-blue-600 text-xl" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">{patient.name}</h2>
                        <p className="text-gray-500">{patient.indexNumber || 'No ID'}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{patient.email}</p>
                    </div>
                    {patient.year && (
                        <div>
                            <p className="text-sm text-gray-500">Year/Semester</p>
                            <p className="font-medium">{patient.year} - {patient.semester}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add New Record */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <FaFileMedical className="mr-2 text-blue-600" />
                    Add New Medical Record
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-lg"
                            value={formData.diagnosis}
                            onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Treatment</label>
                        <textarea
                            className="w-full p-2 border rounded-lg"
                            rows="3"
                            value={formData.treatment}
                            onChange={(e) => setFormData({...formData, treatment: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prescription</label>
                        <textarea
                            className="w-full p-2 border rounded-lg"
                            rows="2"
                            value={formData.prescription}
                            onChange={(e) => setFormData({...formData, prescription: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                            className="w-full p-2 border rounded-lg"
                            rows="2"
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Save Record
                    </button>
                </form>
            </div>

            {/* Medical History */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <FaNotesMedical className="mr-2 text-blue-600" />
                    Medical History
                </h3>
                {records.length === 0 ? (
                    <p className="text-gray-500">No medical records found</p>
                ) : (
                    <div className="space-y-4">
                        {records.map((record, index) => (
                            <div key={index} className="border-b pb-4 last:border-b-0">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium">
                                        {new Date(record.date).toLocaleDateString()} - {record.doctor}
                                    </h4>
                                </div>
                                {record.diagnosis && (
                                    <div className="mb-2">
                                        <p className="text-sm text-gray-500">Diagnosis</p>
                                        <p>{record.diagnosis}</p>
                                    </div>
                                )}
                                {record.treatment && (
                                    <div className="mb-2">
                                        <p className="text-sm text-gray-500">Treatment</p>
                                        <p>{record.treatment}</p>
                                    </div>
                                )}
                                {record.prescription && (
                                    <div className="mb-2">
                                        <p className="text-sm text-gray-500 flex items-center">
                                            <FaPills className="mr-1" /> Prescription
                                        </p>
                                        <p>{record.prescription}</p>
                                    </div>
                                )}
                                {record.notes && (
                                    <div>
                                        <p className="text-sm text-gray-500">Notes</p>
                                        <p className="text-gray-700">{record.notes}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientRecords;