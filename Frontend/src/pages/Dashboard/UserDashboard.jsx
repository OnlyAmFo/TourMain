import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaHistory,
  FaHeart,
  FaCog,
  FaSignOutAlt,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaStar,
  FaCheck,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { bookingsService } from "../../services/bookings";
import { notify } from "../../utils/notifications";
import { getWishlistItems, getWishlistKey } from "../../utils/wishlist";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [completedTrips, setCompletedTrips] = useState([]);
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
    if (!user) return;

    const storedWishlist = getWishlistItems(user);
    setWishlist(storedWishlist);

    const storedCompleted = JSON.parse(localStorage.getItem(`completed_trips_${user.id || user._id || "guest"}`) || "[]");
    setCompletedTrips(storedCompleted);
  }, [user]);

  useEffect(() => {
    if (activeTab === "bookings" || activeTab === "trips") {
      fetchBookings();
    }
  }, [activeTab]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(`completed_trips_${user.id || user._id || "guest"}`, JSON.stringify(completedTrips));
  }, [completedTrips, user]);

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

  const handleMarkCompleted = (bookingId) => {
    setCompletedTrips((prev) => {
      if (prev.includes(bookingId)) {
        return prev.filter((id) => id !== bookingId);
      }
      return [...prev, bookingId];
    });
  };

  const handleRemoveWishlistItem = (placeId) => {
    const key = getWishlistKey(user);
    const next = (getWishlistItems(user) || []).filter((item) => String(item._id || item.id || item.placeId) !== String(placeId));
    localStorage.setItem(key, JSON.stringify(next));
    setWishlist(next);
  };

  const completedBookingIds = new Set(completedTrips);
  const tripHistory = bookings.filter((booking) => completedBookingIds.has(booking._id));

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <FaUser className="text-3xl text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {user?.name || "Traveler"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {user?.email || "No email provided"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Trips booked</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {bookings.length}
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Favorite region</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  Himalayas
                </p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                  Active
                </p>
              </div>
            </div>
          </div>
        );
      case "bookings":
        return (
          <div className="space-y-4">
            {loading ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                Loading bookings...
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center text-gray-600 dark:text-gray-300">
                No bookings found yet. Start planning your next trip.
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start gap-4 flex-col md:flex-row">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {booking.place?.title || "Adventure Trip"}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        People: {booking.numberOfPeople}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        Total: ${booking.totalPrice}
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-3 ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {booking.status?.charAt(0).toUpperCase() + (booking.status || "").slice(1)}
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {booking.status === "confirmed" && (
                        <button
                          onClick={() => handleMarkCompleted(booking._id)}
                          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                        >
                          <FaCheck />
                          {completedBookingIds.has(booking._id) ? "Completed" : "Mark completed"}
                        </button>
                      )}

                      {booking.status === "pending" && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        );
      case "trips":
        return (
          <div className="space-y-4">
            {tripHistory.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center text-gray-600 dark:text-gray-300">
                No completed trips yet. Finish a confirmed tour to see it here.
              </div>
            ) : (
              tripHistory.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Completed</p>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-1">
                        {booking.place?.title || "Mountain Adventure"}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mt-2">
                        <FaMapMarkerAlt />
                        <span>{booking.place?.location || "Nepal"}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-amber-500">
                        <FaStar />
                        <span>{booking.rating || 4.8}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        );
      case "wishlist":
        return (
          <div className="space-y-4">
            {wishlist.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Your wishlist is empty.
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Save places you love and they will appear here.
                </p>
              </div>
            ) : (
              wishlist.map((item) => (
                <div
                  key={item._id || item.placeId}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <img src={item.image} alt={item.title} className="h-16 w-16 rounded-lg object-cover" />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{item.location}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveWishlistItem(item._id || item.placeId)}
                      className="text-red-500 hover:text-red-600 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        );
      case "settings":
        return (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Account Preferences
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <span className="text-gray-700 dark:text-gray-200">Email notifications</span>
                  <span className="text-emerald-600 font-medium">On</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <span className="text-gray-700 dark:text-gray-200">Trip reminders</span>
                  <span className="text-emerald-600 font-medium">Enabled</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <span className="text-gray-700 dark:text-gray-200">Profile visibility</span>
                  <span className="text-emerald-600 font-medium">Public</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 pt-[90px]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
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
