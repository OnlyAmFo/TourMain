import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaSearch } from "react-icons/fa";
import { adminService } from "../../../services/admin";
import { notify } from "../../../utils/notifications";

const BookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setError(null);
      const data = await adminService.getBookings();
      setBookings(data);
      setLoading(false);
    } catch (error) {
      console.error("Bookings fetch error:", error);
      setError(
        error.response?.data?.message ||
          "Failed to fetch bookings. Please check your connection and try again."
      );
      notify.error("Failed to fetch bookings");
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await adminService.updateBookingStatus(bookingId, status);
      notify.success("Booking status updated successfully");
      fetchBookings();
    } catch (error) {
      notify.error("Failed to update booking status");
    }
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      booking &&
      ((booking.user?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        (booking.place?.title || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Bookings Management
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage and monitor all bookings
          </p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
          <p>{error}</p>
          <button
            onClick={fetchBookings}
            className="mt-2 text-sm font-medium hover:text-red-800 dark:hover:text-red-300"
          >
            Try Again
          </button>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm
              ? "No bookings found matching your search."
              : "No bookings found."}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="max-h-[calc(100vh-240px)] overflow-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Place
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {booking.user?.name || "Unknown User"}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {booking.user?.email || "No email"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {booking.place?.title || "Unknown Place"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {new Date(booking.startDate).toLocaleDateString()} -
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(booking.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : booking.status === "cancelled"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.status === "pending" && (
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() =>
                              handleStatusUpdate(booking._id, "confirmed")
                            }
                            className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 transition-colors"
                            title="Confirm Booking"
                          >
                            <FaCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(booking._id, "cancelled")
                            }
                            className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
                            title="Cancel Booking"
                          >
                            <FaTimes className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsManagement;
