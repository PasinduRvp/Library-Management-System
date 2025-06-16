import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '../components/QRScanner';
import PatientRecords from '../components/PatientRecords';

const ScanPatient = () => {
    const [patientId, setPatientId] = useState(null);
    const navigate = useNavigate();

    const handleScanComplete = (userData) => {
        setPatientId(userData.userId);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Patient Records Access</h1>
                
                {!patientId ? (
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <QRScanner onScanComplete={handleScanComplete} />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <button
                            onClick={() => setPatientId(null)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                        >
                            ← Scan Another QR Code
                        </button>
                        <PatientRecords patientId={patientId} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScanPatient;