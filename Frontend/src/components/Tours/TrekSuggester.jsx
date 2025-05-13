import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaMountain,
  FaCalendarAlt,
  FaDollarSign,
  FaHiking,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const TrekSuggester = () => {
  const [preferences, setPreferences] = useState({
    duration: "",
    difficulty: "moderate",
    interests: [],
    budget: "",
  });
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const navigate = useNavigate();

  const interestOptions = [
    "Mountain Views",
    "Wildlife",
    "Cultural Experience",
    "Adventure",
    "Photography",
    "Nature",
    "Historical Sites",
  ];

  // Add trek images for visual appeal
  const trekImages = [
    "/src/assets/places/1.png",
    "/src/assets/places/2.png",
    "/src/assets/places/3.png",
    "/src/assets/places/5.jpg",
    "/src/assets/places/6.jpg",
    "/src/assets/places/7.jpg",
    "/src/assets/places/8.jpg",
    "/src/assets/places/9.jpg",
    "/src/assets/places/10.jpg",
    "/src/assets/18.jpg",
    "/src/assets/19.jpg",
    "/src/assets/22.jpg",
    "/src/assets/23.jpg",
  ];

  const handleInterestToggle = (interest) => {
    setPreferences((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/ai/trek-suggestions",
        {
          preferences,
        }
      );

      setSuggestions(response.data.suggestions);
      setActiveTab("suggestions");
      toast.success("Trek suggestions generated!");
    } catch (error) {
      toast.error("Failed to generate suggestions. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (trek) => {
    // Store the trek details in localStorage for the details page to access
    localStorage.setItem("selectedTrek", JSON.stringify(trek));
    // Navigate to the trek details page
    navigate("/trek-details");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 text-gray-800 dark:text-white">
            Find Your Perfect Trek
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover the perfect trekking adventure based on your preferences,
            budget, and interests.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg overflow-hidden shadow-md">
              <button
                onClick={() => setActiveTab("form")}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "form"
                    ? "bg-emerald-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <FaHiking className="inline-block mr-2" />
                Trek Preferences
              </button>
              <button
                onClick={() => setActiveTab("suggestions")}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "suggestions"
                    ? "bg-emerald-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                disabled={!suggestions}
              >
                <FaMapMarkedAlt className="inline-block mr-2" />
                Trek Suggestions
              </button>
            </div>
          </div>

          {/* Form Tab */}
          {activeTab === "form" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                <div className="md:col-span-2 p-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                          <FaCalendarAlt className="mr-2 text-emerald-500" />
                          Duration (days)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={preferences.duration}
                          onChange={(e) =>
                            setPreferences((prev) => ({
                              ...prev,
                              duration: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                          <FaMountain className="mr-2 text-emerald-500" />
                          Difficulty Level
                        </label>
                        <select
                          value={preferences.difficulty}
                          onChange={(e) =>
                            setPreferences((prev) => ({
                              ...prev,
                              difficulty: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="easy">Easy</option>
                          <option value="moderate">Moderate</option>
                          <option value="challenging">Challenging</option>
                          <option value="difficult">Difficult</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <FaDollarSign className="mr-2 text-emerald-500" />
                        Budget (USD)
                      </label>
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
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Interests
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {interestOptions.map((interest) => (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => handleInterestToggle(interest)}
                            className={`px-4 py-2 rounded-full text-sm transition-colors ${
                              preferences.interests.includes(interest)
                                ? "bg-emerald-500 text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                            }`}
                          >
                            {interest}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-emerald-500 text-white py-3 px-6 rounded-lg hover:bg-emerald-600 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-medium"
                    >
                      {loading
                        ? "Generating Suggestions..."
                        : "Get Trek Suggestions"}
                    </button>
                  </form>
                </div>
                <div className="hidden md:block bg-emerald-600 p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">Why Trek With Us?</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <span className="bg-white text-emerald-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">
                        ✓
                      </span>
                      <span>Expert guides with local knowledge</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-white text-emerald-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">
                        ✓
                      </span>
                      <span>Small group sizes for personalized experience</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-white text-emerald-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">
                        ✓
                      </span>
                      <span>All-inclusive packages with no hidden costs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-white text-emerald-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">
                        ✓
                      </span>
                      <span>Eco-friendly practices to preserve nature</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-white text-emerald-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">
                        ✓
                      </span>
                      <span>Flexible itineraries to suit your pace</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Suggestions Tab */}
          {activeTab === "suggestions" && suggestions && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              variants={containerVariants}
              className="space-y-8"
            >
              <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white text-center">
                Your Personalized Trek Suggestions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={trekImages[index % trekImages.length]}
                        alt={suggestion.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-medium text-emerald-600 dark:text-emerald-400 mb-2">
                        {suggestion.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {suggestion.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-sm px-3 py-1 rounded-full">
                          {suggestion.duration} days
                        </span>
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-3 py-1 rounded-full">
                          ${suggestion.estimatedCost}
                        </span>
                        <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm px-3 py-1 rounded-full">
                          {suggestion.difficulty}
                        </span>
                      </div>
                      <button
                        onClick={() => handleViewDetails(suggestion)}
                        className="w-full bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition duration-300"
                      >
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-8">
                <button
                  onClick={() => setActiveTab("form")}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
                >
                  Modify Preferences
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrekSuggester;
