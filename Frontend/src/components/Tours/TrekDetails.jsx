import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaMountain,
  FaCalendarAlt,
  FaDollarSign,
  FaHiking,
  FaMapMarkedAlt,
  FaArrowLeft,
} from "react-icons/fa";
import { motion } from "framer-motion";

const TrekDetails = () => {
  const [trek, setTrek] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get trek details from localStorage
    const storedTrek = localStorage.getItem("selectedTrek");
    if (storedTrek) {
      setTrek(JSON.parse(storedTrek));
    }
  }, []);

  if (!trek) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Trek Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              The trek you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/trek-suggester")}
              className="bg-emerald-500 text-white py-2 px-6 rounded-lg hover:bg-emerald-600 transition duration-300 flex items-center mx-auto"
            >
              <FaArrowLeft className="mr-2" />
              Back to Trek Suggester
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <button
            onClick={() => navigate("/trek-suggester")}
            className="flex items-center text-emerald-600 hover:text-emerald-700 mb-8"
          >
            <FaArrowLeft className="mr-2" />
            Back to Trek Suggester
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            <div className="h-96 overflow-hidden">
              <img
                src={
                  trek.image ||
                  "https://images.unsplash.com/photo-1551632811-561732d1e306"
                }
                alt={trek.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-8">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                {trek.name}
              </h1>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaCalendarAlt className="mr-2 text-emerald-500" />
                  <span>{trek.duration} days</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaDollarSign className="mr-2 text-emerald-500" />
                  <span>${trek.estimatedCost}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaMountain className="mr-2 text-emerald-500" />
                  <span>{trek.difficulty}</span>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none mb-8">
                <h2 className="text-2xl font-semibold mb-4">Description</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {trek.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Highlights</h2>
                  <ul className="space-y-2">
                    {trek.highlights?.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-emerald-500 mr-2">✓</span>
                        <span className="text-gray-600 dark:text-gray-300">
                          {highlight}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">Best For</h2>
                  <div className="flex flex-wrap gap-2">
                    {trek.bestFor?.map((interest, index) => (
                      <span
                        key={index}
                        className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-3 py-1 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => navigate("/contact")}
                  className="w-full bg-emerald-500 text-white py-3 px-6 rounded-lg hover:bg-emerald-600 transition duration-300 text-lg font-medium"
                >
                  Book This Trek
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TrekDetails;
