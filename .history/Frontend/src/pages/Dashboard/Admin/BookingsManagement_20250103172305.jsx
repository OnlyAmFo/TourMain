import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaSearch, FaFilter, FaUser } from "react-icons/fa";
import { adminService } from "../../../services/admin";
import { notify } from "../../../utils/notifications";

const BookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

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

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      (booking.user?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      ((booking.place?.title || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
        (filterStatus === "all" || booking.status === filterStatus))
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Bookings Management
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage and monitor all bookings
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              <FaFilter className="mr-2" />
              Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            {["all", "pending", "confirmed", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? "bg-emerald-500 text-white"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
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
          <div className="overflow-x-auto">
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
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <FaUser className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {booking.user?.name || "Unknown User"}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {booking.user?.email || "No email"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {booking.place?.title || "Unknown Place"}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {booking.place?.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {new Date(booking.startDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(booking.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        ${booking.totalPrice}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {booking.numberOfPeople} people
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          booking.status
                        )}`}
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
                            className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 transition-colors"
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
        )}
      </div>
    </div>
  );
};

export default BookingsManagement;
