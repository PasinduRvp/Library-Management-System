import React, { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import SummaryApi from "../common";

const MembershipUpload = () => {
  const [slipImage, setSlipImage] = useState(null);
  const [expiryDate, setExpiryDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!slipImage || !expiryDate) {
      return toast.error("Please select a payment slip and expiry date");
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("slipImage", slipImage);
      formData.append("expiryDate", expiryDate);

      const response = await fetch(SummaryApi.uploadMembershipSlip.url, {
        method: SummaryApi.uploadMembershipSlip.method,
        credentials: "include",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Membership slip uploaded successfully!");
        setSlipImage(null);
        setExpiryDate("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error uploading membership slip");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Membership Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Membership Expiry Date
          </label>
          <input
            type="date"
            required
            min={new Date().toISOString().split('T')[0]}
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Slip
          </label>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <p className="text-xs text-gray-500">
                {slipImage ? slipImage.name : "Click to upload payment slip"}
              </p>
            </div>
            <input 
              type="file" 
              onChange={(e) => setSlipImage(e.target.files[0])}
              accept="image/*"
              required
              className="hidden" 
            />
          </label>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
          className="w-full bg-amber-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          {isLoading ? "Uploading..." : "Submit Payment"}
        </motion.button>
      </form>
    </div>
  );
};

export default MembershipUpload;