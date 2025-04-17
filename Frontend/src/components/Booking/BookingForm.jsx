import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import BookingSuccess from "./BookingSuccess";

const BookingForm = ({ place, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [bookingData, setBookingData] = useState({
    startDate: "",
    endDate: "",
    numberOfPeople: 1,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/bookings", {
        placeId: place._id,
        startDate: new Date(bookingData.startDate).toISOString(),
        endDate: new Date(bookingData.endDate).toISOString(),
        numberOfPeople: parseInt(bookingData.numberOfPeople),
      });

      setBookingResult(response.data);
      setShowSuccess(true);
      onSuccess(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return <BookingSuccess onClose={onClose} booking={bookingResult} />;
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Book Your Trip
          </h2>
          <p className="text-gray-600 mb-6">
            {place.title} - ${place.pricePerDay}/day
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={bookingData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={bookingData.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min={bookingData.startDate}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Number of People
              </label>
              <input
                type="number"
                name="numberOfPeople"
                value={bookingData.numberOfPeople}
                onChange={handleChange}
                min="1"
                max={place.maxGroupSize}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Max group size: {place.maxGroupSize}
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              >
                {loading ? "Processing..." : "Confirm Booking"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
