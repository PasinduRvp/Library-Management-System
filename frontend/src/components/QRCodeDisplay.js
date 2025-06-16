import React from 'react';
import { FaDownload } from 'react-icons/fa';
import { saveAs } from 'file-saver';

const QRCodeDisplay = ({ qrCode, name }) => {
    const downloadQRCode = () => {
        saveAs(qrCode, `${name.replace(/\s+/g, '_')}_QRCode.png`);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <h3 className="text-lg font-semibold mb-4">Your QR Code</h3>
            <div className="flex justify-center mb-4">
                <img src={qrCode} alt="QR Code" className="w-48 h-48" />
            </div>
            <button
                onClick={downloadQRCode}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
                <FaDownload />
                Download QR Code
            </button>
            <p className="text-sm text-gray-500 mt-3">
                Show this code to medical staff for quick access to your records
            </p>
        </div>
    );
};

export default QRCodeDisplay;