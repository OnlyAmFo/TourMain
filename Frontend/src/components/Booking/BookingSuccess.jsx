import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { BsPeople } from "react-icons/bs";
import { MdLocationOn } from "react-icons/md";

const BookingSuccess = ({ onClose, booking }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <div className="text-center">
          <FaCheckCircle className="mx-auto text-green-500 text-5xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Booking Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            You have successfully booked{" "}
            <span className="font-semibold text-blue-600">
              {booking?.place?.title}
            </span>
            . Your trek adventure awaits!
          </p>
        </div>

        {/* Booking Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Booking Details:</h3>
          <div className="space-y-3">
            <div className="flex items-center text-gray-700">
              <MdLocationOn className="text-blue-500 mr-2 text-xl" />
              <span className="font-medium">{booking?.place?.title}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <IoCalendarOutline className="text-blue-500 mr-2 text-xl" />
              <span>
                {formatDate(booking?.startDate)} -{" "}
                {formatDate(booking?.endDate)}
              </span>
            </div>
            <div className="flex items-center text-gray-700">
              <BsPeople className="text-blue-500 mr-2 text-xl" />
              <span>{booking?.numberOfPeople} People</span>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-gray-800 font-semibold">
                Total Amount: ${booking?.totalPrice}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            to="/dashboard"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-center"
          >
            View All Bookings
          </Link>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
