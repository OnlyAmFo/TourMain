import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaHistory,
  FaHeart,
  FaCog,
  FaSignOutAlt,
  FaCalendarAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { bookingsService } from "../../services/bookings";
import { notify } from "../../utils/notifications";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 md:mb-0 mx-auto md:mx-0">
                <FaUser className="text-3xl text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {user?.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {user?.email}
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Member since:{" "}
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Last login: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case "bookings":
        return (
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                No bookings found
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
                  >
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {booking.place.title}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {new Date(booking.startDate).toLocaleDateString()} -{" "}
                          {new Date(booking.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          People: {booking.numberOfPeople}
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Total: ${booking.totalPrice}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
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
                        {booking.status === "pending" && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-lg">
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
        {/* Mobile Menu Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={toggleMobileMenu}
            className="fixed top-20 right-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <FaBars className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* Sidebar */}
          <AnimatePresence mode="wait">
            {(isMobileMenuOpen || window.innerWidth >= 1024) && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white dark:bg-gray-800 shadow-lg lg:shadow-none overflow-y-auto transform lg:transform-none ${
                  isMobileMenuOpen
                    ? "translate-x-0"
                    : "-translate-x-full lg:translate-x-0"
                }`}
              >
                <div className="p-4 space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-emerald-600 text-white"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overlay for mobile menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={toggleMobileMenu}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 lg:ml-72">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
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
