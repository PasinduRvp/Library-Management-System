import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import SummaryApi from "../common";

const PendingMemberships = () => {
  const [pendingMemberships, setPendingMemberships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingMemberships();
  }, []);

  const fetchPendingMemberships = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Fetching from:", SummaryApi.getAllPendingMemberships.url);
      
      const response = await fetch(SummaryApi.getAllPendingMemberships.url, {
        method: SummaryApi.getAllPendingMemberships.method,
        credentials: "include",
      });
      
      console.log("Response status:", response.status);
      
      // Check if response is OK before trying to parse JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API response:", data);
      
      if (data.success) {
        console.log("Pending memberships data:", data.data);
        setPendingMemberships(data.data || []); // Ensure it's always an array
      } else {
        setError(data.message || "Failed to fetch pending memberships");
        toast.error(data.message || "Failed to fetch pending memberships");
      }
    } catch (error) {
      console.error("Error fetching pending memberships:", error);
      setError("Error fetching pending memberships: " + error.message);
      toast.error("Error fetching pending memberships");
    } finally {
      setIsLoading(false);
    }
  };

  const approveMembership = async (userId) => {
    try {
      console.log("Approving membership for user:", userId);
      
      const response = await fetch(SummaryApi.approveMembership.url, {
        method: SummaryApi.approveMembership.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Approval response:", data);
      
      if (data.success) {
        toast.success("Membership approved successfully!");
        fetchPendingMemberships(); // Refresh the list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error approving membership:", error);
      toast.error("Error approving membership: " + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pending Memberships</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pending Memberships</h2>
        <div className="text-center p-4">
          <div className="text-red-500 text-lg mb-2">Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchPendingMemberships}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pending Memberships</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {pendingMemberships.length} pending
          </span>
          <button
            onClick={fetchPendingMemberships}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </button>
        </div>
      </div>
      
      {pendingMemberships.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No Pending Memberships</h3>
          <p className="text-gray-500">There are no pending membership requests at this time.</p>
          <p className="text-sm text-gray-400 mt-2">
            Users need to upload payment slips for their membership requests to appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pendingMemberships.map((user) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-gray-600 text-sm">Registration: {user.registrationNumber}</p>
                  {user.membershipPayment?.uploadedAt && (
                    <p className="text-sm text-gray-500 mt-2">
                      Uploaded: {new Date(user.membershipPayment.uploadedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {user.membershipPayment?.slipImage ? (
                    <div className="relative group">
                      <img 
                        src={`http://localhost:8000${user.membershipPayment.slipImage}`} 
                        alt="Payment slip" 
                        className="w-24 h-24 object-contain border rounded-lg shadow-sm cursor-pointer"
                        onClick={() => window.open(`http://localhost:8000${user.membershipPayment.slipImage}`, '_blank')}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-24 h-24 border rounded-lg bg-gray-100 flex items-center justify-center hidden group-hover:bg-gray-200 transition-colors cursor-pointer">
                        <span className="text-2xl">📄</span>
                        <span className="text-xs absolute bottom-1">Image missing</span>
                      </div>
                      <div className="text-xs text-center mt-1 text-blue-500">Click to view</div>
                    </div>
                  ) : (
                    <div className="w-24 h-24 border rounded-lg bg-gray-100 flex items-center justify-center">
                      <span className="text-2xl">❌</span>
                      <span className="text-xs absolute bottom-1">No slip</span>
                    </div>
                  )}
                  
                  <button
                    onClick={() => approveMembership(user._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg whitespace-nowrap"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingMemberships;