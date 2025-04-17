import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaHistory,
  FaHeart,
  FaCog,
  FaSignOutAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { bookingsService } from "../../services/bookings";
import { notify } from "../../utils/notifications";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "bookings", label: "My Bookings", icon: <FaCalendarAlt /> },
    { id: "trips", label: "Trip History", icon: <FaHistory /> },
    { id: "wishlist", label: "Wishlist", icon: <FaHeart /> },
    { id: "settings", label: "Settings", icon: <FaCog /> },
  ];

  useEffect(() => {
    if (activeTab === "bookings") {
      fetchBookings();
    }
  }, [activeTab]);

  const fetchBookings = async () => {
    try {
      const data = await bookingsService.getMyBookings();
      setBookings(data);
      setLoading(false);
    } catch (error) {
      notify.error("Failed to fetch bookings");
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingsService.cancelBooking(bookingId);
      notify.success("Booking cancelled successfully");
      fetchBookings();
    } catch (error) {
      notify.error("Failed to cancel booking");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <FaUser className="text-3xl text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {user?.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        );
      case "bookings":
        return (
          <div className="space-y-4">
            {loading ? (
              <div>Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                No bookings found
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {booking.place.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {new Date(booking.startDate).toLocaleDateString()} -{" "}
                        {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        People: {booking.numberOfPeople}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        Total: ${booking.totalPrice}
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </div>
                    {booking.status === "pending" && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        );
      default:
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <p className="text-gray-600 dark:text-gray-300">
              This feature is coming soon...
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 pt-[90px]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-emerald-600 text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>

          {/* Main Content smooth button click*/}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
