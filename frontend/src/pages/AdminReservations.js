import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import SummaryApi from "../common";

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [editingReservation, setEditingReservation] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [actualReturnDate, setActualReturnDate] = useState("");

  useEffect(() => {
    fetchReservations();
  }, [selectedStatus]);

  const fetchReservations = async () => {
    try {
      const response = await fetch(SummaryApi.getAllReservations.url, {
        method: SummaryApi.getAllReservations.method,
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        // Filter by status if not "All"
        let filteredData = data.data;
        if (selectedStatus !== "All") {
          filteredData = data.data.filter(res => res.status.toUpperCase() === selectedStatus.toUpperCase());
        }
        setReservations(filteredData);
      }
    } catch (error) {
      toast.error("Error fetching reservations");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to increase book count
  const increaseBookCount = async (bookId) => {
    try {
      const response = await fetch(SummaryApi.increaseBookCount.url(bookId), {
        method: SummaryApi.increaseBookCount.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Error increasing book count:", error);
      return false;
    }
  };

  const updateReservationStatus = async (id, status) => {
    try {
      const updateData = {
        status: status.toUpperCase(),
        adminNotes: adminNotes || undefined
      };
      
      // Add actual return date if provided
      if (actualReturnDate && (status === "COMPLETED" || status === "OVERDUE")) {
        updateData.actualReturnDate = actualReturnDate;
      }

      console.log("Updating reservation:", id, "with data:", updateData);

      // Use the correct endpoint from SummaryApi
      const response = await fetch(SummaryApi.updateReservationStatus.url(id), {
        method: SummaryApi.updateReservationStatus.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      // Check if response is OK before trying to parse JSON
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response:", data);
      
      if (data.success) {
        // If status is COMPLETED, increase the book count
        if (status.toUpperCase() === "COMPLETED") {
          const reservation = reservations.find(res => res._id === id);
          if (reservation && reservation.bookId) {
            const bookCountIncreased = await increaseBookCount(reservation.bookId._id);
            if (!bookCountIncreased) {
              toast.warning("Reservation completed but failed to update book count");
            }
          }
        }

        toast.success(`Reservation ${status.toLowerCase()} successfully!`);
        setEditingReservation(null);
        setAdminNotes("");
        setActualReturnDate("");
        fetchReservations();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Error updating reservation: " + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case "APPROVED": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-amber-100 text-amber-800";
      case "DECLINED": return "bg-red-100 text-red-800";
      case "COMPLETED": return "bg-blue-100 text-blue-800";
      case "CANCELLED": return "bg-gray-100 text-gray-800";
      case "OVERDUE": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Reservation Management</h1>
              <p className="text-gray-600">Manage book reservations from users</p>
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            >
              <option value="All">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="DECLINED">Declined</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>
        </div>

        {reservations.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No reservations found</h3>
            <p className="text-gray-500">There are no reservations with the selected status.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {reservations.map((reservation) => (
              <motion.div
                key={reservation._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-shrink-0">
                    {reservation.bookId?.image ? (
                      <img
                        src={`http://localhost:8000${reservation.bookId.image}`}
                        alt={reservation.bookId.name}
                        className="w-24 h-32 object-contain rounded-lg shadow-md"
                      />
                    ) : (
                      <div className="w-24 h-32 bg-amber-50 rounded-lg flex items-center justify-center shadow-md">
                        <span className="text-2xl">📚</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                          {reservation.bookId?.name}
                        </h3>
                        <p className="text-gray-600 mb-2">by {reservation.bookId?.author}</p>
                        <p className="text-sm text-gray-500">
                          Available: {reservation.bookId?.availableCount || 0} copies
                        </p>
                      </div>
                      
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                        {formatStatus(reservation.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">User</p>
                        <p className="font-medium text-gray-800">{reservation.userName}</p>
                        <p className="text-sm text-gray-600">{reservation.userEmail}</p>
                        <p className="text-sm text-gray-600">{reservation.userPhone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Pickup Date</p>
                        <p className="font-medium text-gray-800">
                          {new Date(reservation.pickupDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Expected Return</p>
                        <p className="font-medium text-gray-800">
                          {new Date(reservation.expectedReturnDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Requested On</p>
                        <p className="font-medium text-gray-800">
                          {new Date(reservation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {reservation.actualReturnDate && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">Actual Return Date</p>
                        <p className="font-medium text-gray-800">
                          {new Date(reservation.actualReturnDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    {reservation.fineAmount > 0 && (
                      <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-100">
                        <p className="text-sm text-red-800">
                          <strong>Fine Amount:</strong> Rs. {reservation.fineAmount}
                          {reservation.finePaid ? " (Paid)" : " (Unpaid)"}
                        </p>
                      </div>
                    )}

                    {reservation.adminNotes && (
                      <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
                        <p className="text-sm text-amber-800">
                          <strong>Admin Notes:</strong> {reservation.adminNotes}
                        </p>
                      </div>
                    )}

                    {(reservation.status === "PENDING" || reservation.status === "APPROVED") && (
                      <div className="flex flex-wrap gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setEditingReservation(reservation);
                            setAdminNotes(reservation.adminNotes || "");
                            setActualReturnDate("");
                          }}
                          className="px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors shadow-md hover:shadow-lg"
                        >
                          Manage Reservation
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>

                {editingReservation?._id === reservation._id && (
                  <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <h4 className="font-medium text-gray-800 mb-3">Update Reservation</h4>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Notes (Optional)
                      </label>
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add notes for the user..."
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none transition-all"
                        rows="3"
                      />
                    </div>

                    {(reservation.status === "APPROVED") && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Actual Return Date (for completion)
                        </label>
                        <input
                          type="date"
                          value={actualReturnDate}
                          onChange={(e) => setActualReturnDate(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      {reservation.status === "PENDING" && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateReservationStatus(reservation._id, "APPROVED")}
                            className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                          >
                            Approve
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateReservationStatus(reservation._id, "DECLINED")}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
                          >
                            Decline
                          </motion.button>
                        </>
                      )}
                      
                      {reservation.status === "APPROVED" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateReservationStatus(reservation._id, "COMPLETED")}
                          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                        >
                          Mark as Completed
                        </motion.button>
                      )}
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setEditingReservation(null)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReservations;