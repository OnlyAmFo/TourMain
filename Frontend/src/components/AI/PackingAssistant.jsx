import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaSuitcase,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCloudSun,
  FaTshirt,
  FaUmbrella,
  FaShower,
  FaFirstAid,
  FaLaptop,
  FaCheck,
  FaSun,
  FaHiking,
} from "react-icons/fa";

const PackingAssistant = () => {
  const [tripDetails, setTripDetails] = useState({
    destination: "",
    duration: "",
    season: "",
    activities: [],
    specialNeeds: "",
  });
  const [packingList, setPackingList] = useState([]);
  const [loading, setLoading] = useState(false);

  const activityOptions = [
    "Beach",
    "Hiking",
    "City Tour",
    "Business",
    "Camping",
    "Skiing",
    "Swimming",
    "Photography",
  ];

  const handleActivityToggle = (activity) => {
    setTripDetails((prev) => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter((a) => a !== activity)
        : [...prev.activities, activity],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/ai/packing-list",
        tripDetails
      );

      // Transform the response into the expected format
      const transformedList = [
        {
          name: "Essential Items",
          icon: <FaSuitcase className="text-emerald-600" />,
          items: response.data.essentials || [],
        },
        {
          name: "Clothing",
          icon: <FaTshirt className="text-emerald-600" />,
          items: response.data.clothing || [],
        },
        {
          name: "Toiletries",
          icon: <FaShower className="text-emerald-600" />,
          items: response.data.toiletries || [],
        },
        {
          name: "Electronics",
          icon: <FaLaptop className="text-emerald-600" />,
          items: response.data.electronics || [],
        },
        {
          name: "First Aid & Health",
          icon: <FaFirstAid className="text-emerald-600" />,
          items: response.data.firstAid || [],
        },
      ];

      setPackingList(transformedList);
    } catch (error) {
      toast.error("Failed to generate packing list. Please try again.");
      console.error("Error generating packing list:", error);
      setPackingList([]);
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
            Smart Packing Assistant
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get a personalized packing list for your Nepal adventure
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Trip Details Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 border border-emerald-100 dark:border-gray-700"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Destination
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="h-5 w-5 text-emerald-500" />
                  </div>
                  <input
                    type="text"
                    value={tripDetails.destination}
                    onChange={(e) =>
                      setTripDetails({
                        ...tripDetails,
                        destination: e.target.value,
                      })
                    }
                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    placeholder="e.g., Kathmandu, Pokhara"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Duration (days)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaCalendarAlt className="h-5 w-5 text-emerald-500" />
                  </div>
                  <input
                    type="number"
                    value={tripDetails.duration}
                    onChange={(e) =>
                      setTripDetails({
                        ...tripDetails,
                        duration: e.target.value,
                      })
                    }
                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Season
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaSun className="h-5 w-5 text-emerald-500" />
                  </div>
                  <select
                    value={tripDetails.season}
                    onChange={(e) =>
                      setTripDetails({
                        ...tripDetails,
                        season: e.target.value,
                      })
                    }
                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    required
                  >
                    <option value="">Select a season</option>
                    <option value="spring">Spring</option>
                    <option value="summer">Summer</option>
                    <option value="autumn">Autumn</option>
                    <option value="winter">Winter</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Activities
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {activityOptions.map((activity) => (
                    <button
                      key={activity}
                      type="button"
                      onClick={() => handleActivityToggle(activity)}
                      className={`flex items-center justify-center p-3 rounded-xl border transition-colors ${
                        tripDetails.activities.includes(activity)
                          ? "bg-emerald-100 dark:bg-emerald-900 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                          : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-emerald-500 dark:hover:border-emerald-400"
                      }`}
                    >
                      <FaHiking className="mr-2" />
                      {activity}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-4 px-6 rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 flex items-center justify-center text-lg font-medium shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Generating Packing List...
                  </>
                ) : (
                  <>
                    <FaSuitcase className="mr-3 text-xl" />
                    Generate Packing List
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Packing List Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 border border-emerald-100 dark:border-gray-700"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
              Your Packing List
            </h2>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
              </div>
            ) : packingList.length > 0 ? (
              <div className="space-y-8">
                {packingList.map((category, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-700 pb-8 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center mb-4">
                      {category.icon}
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-3">
                        {category.name}
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {category.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-center text-gray-600 dark:text-gray-300"
                        >
                          <FaCheck className="text-emerald-500 mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-16">
                <FaSuitcase className="mx-auto h-16 w-16 mb-6 text-emerald-600" />
                <p className="text-xl">
                  Fill in your trip details to get a personalized packing list
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PackingAssistant;
