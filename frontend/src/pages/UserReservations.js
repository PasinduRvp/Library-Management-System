import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import SummaryApi from "../common";

const UserReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch(SummaryApi.getUserReservations.url, {
        method: SummaryApi.getUserReservations.method,
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setReservations(data.data);
      }
    } catch (error) {
      toast.error("Error fetching reservations");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelReservation = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }

    try {
      const response = await fetch(SummaryApi.cancelReservation.url(id), {
        method: SummaryApi.cancelReservation.method,
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Reservation cancelled successfully!");
        fetchReservations();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error cancelling reservation");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-800";
      case "Pending": return "bg-amber-100 text-amber-800";
      case "Declined": return "bg-red-100 text-red-800";
      case "Completed": return "bg-blue-100 text-blue-800";
      case "Cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
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
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Reservations</h1>
            <p className="text-gray-600">Manage your book reservations</p>
          </div>
        </div>

        {reservations.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No reservations yet</h3>
            <p className="text-gray-500">You haven't made any book reservations yet.</p>
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
                <div className="flex flex-col md:flex-row gap-6">
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
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {reservation.bookId?.name}
                    </h3>
                    <p className="text-gray-600 mb-2">by {reservation.bookId?.author}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Pickup Date</p>
                        <p className="font-medium text-gray-800">
                          {new Date(reservation.pickupDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Return Date</p>
                        <p className="font-medium text-gray-800">
                          {new Date(reservation.actualReturnDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                        {reservation.status}
                      </span>
                      
                      {reservation.status === "Pending" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => cancelReservation(reservation._id)}
                          className="px-4 py-2 bg-red-100 text-red-800 rounded-xl text-sm font-medium hover:bg-red-200 transition-colors shadow-md hover:shadow-lg"
                        >
                          Cancel Reservation
                        </motion.button>
                      )}
                    </div>

                    {reservation.adminNotes && (
                      <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
                        <p className="text-sm text-amber-800">
                          <strong>Admin Notes:</strong> {reservation.adminNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReservations;