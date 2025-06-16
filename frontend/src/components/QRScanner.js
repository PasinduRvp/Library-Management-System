import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const QRScanner = ({ onScanComplete }) => {
    const [scanner, setScanner] = useState(null);

    useEffect(() => {
        const html5QrcodeScanner = new Html5QrcodeScanner(
            "qr-scanner-container",
            { fps: 10, qrbox: 250 },
            false
        );

        const onScanSuccess = (decodedText) => {
            try {
                const userData = JSON.parse(decodedText);
                onScanComplete(userData);
                html5QrcodeScanner.clear();
            } catch (error) {
                toast.error("Invalid QR code. Please scan a valid patient QR code.");
            }
        };

        const onScanFailure = (error) => {
            // Handle scan failure
        };

        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
        setScanner(html5QrcodeScanner);

        return () => {
            if (html5QrcodeScanner) {
                html5QrcodeScanner.clear();
            }
        };
    }, [onScanComplete]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">Scan Patient QR Code</h3>
            <div id="qr-scanner-container" className="w-full"></div>
        </div>
    );
};

export default QRScanner;