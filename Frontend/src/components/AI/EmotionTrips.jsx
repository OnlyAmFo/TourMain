import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaHeart,
  FaSpinner,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaLeaf,
  FaMountain,
  FaWater,
  FaCity,
  FaUmbrellaBeach,
  FaPrayingHands,
} from "react-icons/fa";

const EmotionTrips = () => {
  const [mood, setMood] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const moodOptions = [
    {
      value: "stressed",
      label: "Stressed",
      icon: <FaLeaf className="text-2xl" />,
      description: "Need to unwind and find peace",
    },
    {
      value: "energetic",
      label: "Energetic",
      icon: <FaMountain className="text-2xl" />,
      description: "Ready for adventure and excitement",
    },
    {
      value: "romantic",
      label: "Romantic",
      icon: <FaHeart className="text-2xl" />,
      description: "Looking for intimate experiences",
    },
    {
      value: "reflective",
      label: "Reflective",
      icon: <FaPrayingHands className="text-2xl" />,
      description: "Seeking spiritual or cultural experiences",
    },
    {
      value: "relaxed",
      label: "Relaxed",
      icon: <FaWater className="text-2xl" />,
      description: "Want to take it easy and enjoy",
    },
    {
      value: "curious",
      label: "Curious",
      icon: <FaCity className="text-2xl" />,
      description: "Eager to explore and learn",
    },
    {
      value: "playful",
      label: "Playful",
      icon: <FaUmbrellaBeach className="text-2xl" />,
      description: "Looking for fun and entertainment",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mood) {
      toast.error("Please select your current mood");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/api/ai/emotion-trips", { mood });
      setRecommendations(response.data.recommendations);
    } catch (error) {
      toast.error("Failed to get trip recommendations. Please try again.");
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Emotion-Based Trip Recommender
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover perfect trips in Nepal based on your current mood
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Mood Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 border border-emerald-100 dark:border-gray-700"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-6">
                  How are you feeling today?
                </label>
                <div className="grid grid-cols-2 gap-6">
                  {moodOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setMood(option.value)}
                      className={`p-6 rounded-xl border transition-all duration-200 flex flex-col items-center ${
                        mood === option.value
                          ? "border-emerald-500 bg-emerald-50 shadow-md"
                          : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md"
                      }`}
                    >
                      <div
                        className={`mb-3 text-3xl ${
                          mood === option.value
                            ? "text-emerald-600"
                            : "text-gray-600"
                        }`}
                      >
                        {option.icon}
                      </div>
                      <span
                        className={`font-medium text-lg ${
                          mood === option.value
                            ? "text-emerald-700"
                            : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </span>
                      <span
                        className={`text-sm mt-2 ${
                          mood === option.value
                            ? "text-emerald-600"
                            : "text-gray-500"
                        }`}
                      >
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !mood}
                className="w-full bg-emerald-600 text-white py-4 px-6 rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 flex items-center justify-center text-lg font-medium shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Finding Perfect Trips...
                  </>
                ) : (
                  <>
                    <FaHeart className="mr-3 text-xl" />
                    Find Your Perfect Trip
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Recommendations Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 border border-emerald-100 dark:border-gray-700"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
              Recommended Trips for Your Mood
            </h2>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="space-y-8">
                {recommendations.map((trip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-emerald-100 rounded-xl p-8 bg-gradient-to-br from-white to-emerald-50 shadow-md"
                  >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                      {trip.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                      {trip.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center text-gray-600 dark:text-gray-300 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <FaMapMarkerAlt className="mr-3 text-emerald-600 text-lg" />
                        <span className="font-medium">{trip.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <FaCalendarAlt className="mr-3 text-emerald-600 text-lg" />
                        <span className="font-medium">{trip.bestTime}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <FaHeart className="mr-3 text-emerald-600 text-lg" />
                        <span className="font-medium">
                          {trip.moodMatch}% Mood Match
                        </span>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">
                        Why This Trip Matches Your Mood
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-lg">
                        {trip.whyThisTrip}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-lg">
                        Highlights
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {trip.highlights.map((highlight, idx) => (
                          <div
                            key={idx}
                            className="flex items-center text-gray-600 dark:text-gray-300 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                          >
                            <FaLeaf className="mr-3 text-emerald-600 text-lg" />
                            <span className="font-medium">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-16">
                <FaHeart className="mx-auto h-16 w-16 mb-6 text-emerald-600" />
                <p className="text-xl">
                  Select your mood to get personalized trip recommendations
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EmotionTrips;
