import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TrekSuggester = () => {
  const [preferences, setPreferences] = useState({
    duration: "",
    difficulty: "moderate",
    interests: [],
    budget: "",
  });
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);

  const interestOptions = [
    "Mountain Views",
    "Wildlife",
    "Cultural Experience",
    "Adventure",
    "Photography",
    "Nature",
    "Historical Sites",
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
      toast.success("Trek suggestions generated!");
    } catch (error) {
      toast.error("Failed to generate suggestions. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 mt-20">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
        Find Your Perfect Trek
      </h1>

      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Budget (USD)
            </label>
            <input
              type="number"
              min="0"
              value={preferences.budget}
              onChange={(e) =>
                setPreferences((prev) => ({ ...prev, budget: e.target.value }))
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
            {loading ? "Generating Suggestions..." : "Get Trek Suggestions"}
          </button>
        </form>

        {suggestions && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
              Suggested Treks
            </h2>
            <div className="space-y-6">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md"
                >
                  <h3 className="text-xl font-medium text-emerald-600 dark:text-emerald-400">
                    {suggestion.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-3">
                    {suggestion.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
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
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrekSuggester;
