import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaUtensils,
  FaHotel,
  FaHiking,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const ItineraryGenerator = () => {
  const [preferences, setPreferences] = useState({
    destination: "",
    duration: "",
    interests: [],
    budget: "",
    travelStyle: "",
    groupSize: "",
    season: "",
  });

  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);

  const interests = [
    "Cultural Heritage",
    "Adventure Sports",
    "Nature & Wildlife",
    "Food & Cuisine",
    "Photography",
    "Shopping",
    "Religious Sites",
    "Local Markets",
  ];

  const travelStyles = [
    "Luxury",
    "Budget",
    "Adventure",
    "Cultural",
    "Relaxed",
    "Fast-paced",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/ai/trip-plan", {
        destination: preferences.destination,
        duration: preferences.duration,
        preferences: {
          travelStyle: preferences.travelStyle,
          interests: preferences.interests,
          budget: preferences.budget,
          groupSize: preferences.groupSize,
          season: preferences.season,
        },
      });

      // Parse the AI response into structured itinerary
      const parsedItinerary = parseAIResponse(response.data.plan);
      setItinerary(parsedItinerary);
    } catch (error) {
      toast.error("Failed to generate itinerary. Please try again.");
      console.error("Error generating itinerary:", error);
    } finally {
      setLoading(false);
    }
  };

  const parseAIResponse = (response) => {
    const days = response
      .split("\n\n")
      .filter((day) => day.trim().startsWith("Day"));
    return days.map((day) => {
      const lines = day.split("\n");
      const dayNumber = lines[0].split(":")[0];
      const activities = {
        morning: "",
        afternoon: "",
        evening: "",
        accommodation: "",
        meals: "",
      };

      lines.slice(1).forEach((line) => {
        if (line.includes("Morning:")) {
          activities.morning = line.split(":")[1].trim();
        } else if (line.includes("Afternoon:")) {
          activities.afternoon = line.split(":")[1].trim();
        } else if (line.includes("Evening:")) {
          activities.evening = line.split(":")[1].trim();
        } else if (line.includes("Accommodation:")) {
          activities.accommodation = line.split(":")[1].trim();
        } else if (line.includes("Meals:")) {
          activities.meals = line.split(":")[1].trim();
        }
      });

      return {
        day: dayNumber,
        ...activities,
      };
    });
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
            AI Itinerary Generator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Create personalized day-by-day tour plans for your Nepal adventure
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Preferences Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 border border-emerald-100 dark:border-gray-700"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Destination
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={preferences.destination}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        destination: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., Kathmandu Valley"
                    required
                  />
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration (days)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={preferences.duration}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., 7"
                    required
                  />
                  <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Travel Style
                </label>
                <div className="relative">
                  <select
                    value={preferences.travelStyle}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        travelStyle: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select Travel Style</option>
                    {travelStyles.map((style) => (
                      <option key={style} value={style.toLowerCase()}>
                        {style}
                      </option>
                    ))}
                  </select>
                  <FaHiking className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Interests
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {interests.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() =>
                        setPreferences((prev) => ({
                          ...prev,
                          interests: prev.interests.includes(interest)
                            ? prev.interests.filter((i) => i !== interest)
                            : [...prev.interests, interest],
                        }))
                      }
                      className={`flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        preferences.interests.includes(interest)
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Budget (USD)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={preferences.budget}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        budget: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., 1000"
                    required
                  />
                  <FaUtensils className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Group Size
                </label>
                <div className="relative">
                  <select
                    value={preferences.groupSize}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        groupSize: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select Group Size</option>
                    <option value="1-2">1-2 People</option>
                    <option value="3-5">3-5 People</option>
                    <option value="6-10">6-10 People</option>
                    <option value="10+">10+ People</option>
                  </select>
                  <FaHotel className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Season
                </label>
                <div className="relative">
                  <select
                    value={preferences.season}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        season: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select Season</option>
                    <option value="spring">Spring</option>
                    <option value="summer">Summer</option>
                    <option value="autumn">Autumn</option>
                    <option value="winter">Winter</option>
                  </select>
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                ) : (
                  <FaCalendarAlt className="mr-2" />
                )}
                {loading ? "Generating Itinerary..." : "Generate Itinerary"}
              </button>
            </form>
          </motion.div>

          {/* Itinerary Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 border border-emerald-100 dark:border-gray-700"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Your Itinerary
            </h2>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
              </div>
            ) : itinerary && itinerary.length > 0 ? (
              <div className="space-y-8">
                {itinerary.map((day, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-700 pb-8 last:border-0 last:pb-0"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      {day.day}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Morning
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {day.morning}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Afternoon
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {day.afternoon}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Evening
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {day.evening}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Accommodation
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {day.accommodation}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Meals
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {day.meals}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                <FaCalendarAlt className="mx-auto h-12 w-12 mb-4" />
                <p>
                  Fill in your preferences to generate a personalized itinerary
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryGenerator;
