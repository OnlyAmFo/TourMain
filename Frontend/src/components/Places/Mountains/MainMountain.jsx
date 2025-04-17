import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Navbar/Navbar";
import Places from "../Places";
import { FaChevronDown } from "react-icons/fa";
import BookingForm from "../../Booking/BookingForm";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../services/api";

const MainMountain = ({
  backgroundImage,
  title,
  description,
  placesLimit = 3,
  excludeLink,
  nextMountainLink = "/",
  highlights = [],
  altitude,
  duration,
  difficulty,
  bestSeason,
  placeData,
}) => {
  const { user } = useAuth();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);

  useEffect(() => {
    // Check if the user has already booked this trek
    const checkBookingStatus = async () => {
      if (user && placeData?._id) {
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
      }
    };

    checkBookingStatus();
  }, [user, placeData?._id]);

  const handleBookingSuccess = () => {
    setShowBookingForm(false);
    setIsBooked(true);
    setShowBookingSuccess(true);
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowBookingSuccess(false);
    }, 3000);
  };

  const scrollToTrekSection = () => {
    const trekSection = document.getElementById("trek-section");
    if (trekSection) {
      const navHeight = 80; // Approximate navbar height
      const targetPosition = trekSection.offsetTop - navHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen">
        {/* Success Message */}
        {showBookingSuccess && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-down">
            Booking Successful! Check your dashboard for details.
          </div>
        )}

        {/* Hero Section */}
        <div
          className="relative min-h-screen flex flex-col justify-between"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            paddingTop: "6rem",
          }}
        >
          {/* Content Container */}
          <div className="flex-1 flex items-center">
            <div className="container mx-auto px-4 text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in mt-16">
                {title}
              </h1>
              <div className="max-w-3xl mx-auto">
                <p className="text-lg md:text-xl mb-8 leading-relaxed">
                  {description}
                </p>
                {/* Book Now Button */}
                {user && (
                  <button
                    onClick={() => !isBooked && setShowBookingForm(true)}
                    className={`px-8 py-3 rounded-lg text-lg font-semibold transition-colors mb-8 ${
                      isBooked
                        ? "bg-green-500 text-white cursor-default"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    disabled={isBooked}
                  >
                    {isBooked ? "Trek Booked" : "Book This Trek"}
                  </button>
                )}
                {/* Trek Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {altitude && (
                    <div className="bg-black bg-opacity-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-400">
                        Max Altitude
                      </h3>
                      <p>{altitude}</p>
                    </div>
                  )}
                  {duration && (
                    <div className="bg-black bg-opacity-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-400">Duration</h3>
                      <p>{duration}</p>
                    </div>
                  )}
                  {difficulty && (
                    <div className="bg-black bg-opacity-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-400">
                        Difficulty
                      </h3>
                      <p>{difficulty}</p>
                    </div>
                  )}
                  {bestSeason && (
                    <div className="bg-black bg-opacity-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-400">
                        Best Season
                      </h3>
                      <p>{bestSeason}</p>
                    </div>
                  )}
                </div>
                {/* Highlights */}
                {highlights.length > 0 && (
                  <div className="bg-black bg-opacity-50 p-6 rounded-lg trek-highlights">
                    <h2 className="text-2xl font-bold mb-4 text-blue-400">
                      Trek Highlights
                    </h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                      {highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center">
                          <span className="mr-2">•</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section with Scroll Indicator */}
          <div className="relative h-24 flex items-center justify-center">
            <div
              className="scroll-indicator"
              onClick={scrollToTrekSection}
              aria-label="Scroll to trek details"
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === "Enter" && scrollToTrekSection()}
            >
              <FaChevronDown className="text-white text-3xl" />
            </div>
          </div>
        </div>

        {/* Related Treks Section */}
        <div id="trek-section" className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
              Explore Similar Treks
            </h2>
            <Places
              limit={placesLimit}
              excludeLink={excludeLink}
              randomize={true}
            />
          </div>
        </div>

        {/* Next Trek Link */}
        <Link
          to={nextMountainLink}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          Next Trek →
        </Link>

        {/* Booking Form Modal */}
        {showBookingForm && (
          <BookingForm
            place={placeData}
            onClose={() => setShowBookingForm(false)}
            onSuccess={handleBookingSuccess}
          />
        )}
      </div>
    </>
  );
};

export default MainMountain;
