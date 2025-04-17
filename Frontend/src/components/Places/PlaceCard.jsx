import React, { useState, useEffect, useCallback, memo } from "react";
import { IoLocationSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BookingForm from "../Booking/BookingForm";
import api from "../../services/api";
import { FaMountain, FaClock, FaThermometerHalf } from "react-icons/fa";
import { BsCalendarCheck } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

// Animation variants for better organization and reuse
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { y: -5 },
};

const imageVariants = {
  normal: { scale: 1 },
  hover: { scale: 1.1 },
};

const overlayVariants = {
  normal: { opacity: 0.2 },
  hover: { opacity: 0.1 },
};

const statsItemVariants = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

const PlaceCard = memo(
  ({
    img,
    title,
    location,
    description,
    price: pricePerDay,
    type,
    link,
    placeData,
  }) => {
    const { user } = useAuth();
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [isBooked, setIsBooked] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Memoized booking status check
    const checkBookingStatus = useCallback(async () => {
      if (!user || !placeData?._id) return;

      try {
        const response = await api.get("/bookings/my-bookings");
        const hasBooked = response.data.some(
          (booking) =>
            booking.place._id === placeData._id &&
            booking.status !== "cancelled"
        );
        setIsBooked(hasBooked);
      } catch (error) {
        console.error("Error checking booking status:", error);
      }
    }, [user, placeData?._id]);

    useEffect(() => {
      checkBookingStatus();
    }, [checkBookingStatus]);

    const handleBookingSuccess = useCallback(() => {
      setShowBookingForm(false);
      setIsBooked(true);
    }, []);

    // Memoized stats items for better performance
    const statsItems = [
      { icon: <FaMountain />, value: placeData.difficulty },
      { icon: <FaClock />, value: placeData.duration },
      { icon: <FaThermometerHalf />, value: placeData.altitude },
      { icon: <BsCalendarCheck />, value: placeData.bestSeason },
    ];

    return (
      <>
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          transition={{ duration: 0.3 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className="h-full flex flex-col bg-white dark:bg-slate-950 shadow-lg transition-all duration-500 hover:shadow-xl dark:text-white rounded-lg overflow-hidden"
        >
          {/* Image Section */}
          <div className="relative h-48 overflow-hidden">
            <Link to={link} className="block h-full">
              <motion.img
                src={img}
                alt={title}
                variants={imageVariants}
                animate={isHovered ? "hover" : "normal"}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <motion.div
                variants={overlayVariants}
                animate={isHovered ? "hover" : "normal"}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black"
              />
            </Link>
            <motion.div
              className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium"
              whileHover={{ scale: 1.05 }}
            >
              ${pricePerDay}/day
            </motion.div>
          </div>

          {/* Content Section */}
          <div className="flex flex-col flex-grow p-4 space-y-3">
            <motion.h1
              className="text-xl font-bold text-gray-800 dark:text-white h-14 line-clamp-2"
              animate={{ color: isHovered ? "#3B82F6" : "" }}
            >
              {title}
            </motion.h1>

            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <IoLocationSharp className="text-blue-500 flex-shrink-0" />
              <span className="ml-1 truncate">{location}</span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              {statsItems.map((item, index) => (
                <motion.div
                  key={index}
                  variants={statsItemVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="flex items-center text-gray-600 dark:text-gray-300"
                >
                  <span className="text-blue-500 mr-2 flex-shrink-0">
                    {item.icon}
                  </span>
                  <span className="truncate">{item.value}</span>
                </motion.div>
              ))}
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm h-12 line-clamp-2">
              {description}
            </p>

            {/* Booking Button */}
            {user && (
              <div className="pt-4 mt-auto">
                <motion.button
                  onClick={() => !isBooked && setShowBookingForm(true)}
                  whileHover={{ scale: isBooked ? 1 : 1.02 }}
                  whileTap={{ scale: isBooked ? 1 : 0.98 }}
                  className={`w-full py-2.5 rounded-lg transition-colors font-medium ${
                    isBooked
                      ? "bg-green-500 text-white cursor-default"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  disabled={isBooked}
                >
                  {isBooked ? "Booked" : "Book Now"}
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Booking Form Modal */}
        <AnimatePresence>
          {showBookingForm && (
            <BookingForm
              place={placeData}
              onClose={() => setShowBookingForm(false)}
              onSuccess={handleBookingSuccess}
            />
          )}
        </AnimatePresence>
      </>
    );
  }
);

PlaceCard.displayName = "PlaceCard";

export default PlaceCard;
