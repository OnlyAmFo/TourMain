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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Find Your Perfect Trek
      </h1>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="challenging">Challenging</option>
              <option value="difficult">Difficult</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget (USD)
            </label>
            <input
              type="number"
              min="0"
              value={preferences.budget}
              onChange={(e) =>
                setPreferences((prev) => ({ ...prev, budget: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    preferences.interests.includes(interest)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 disabled:bg-gray-400"
          >
            {loading ? "Generating Suggestions..." : "Get Trek Suggestions"}
          </button>
        </form>

        {suggestions && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Suggested Treks</h2>
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-600">
                    {suggestion.name}
                  </h3>
                  <p className="text-gray-600 mt-2">{suggestion.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {suggestion.duration} days
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      ${suggestion.estimatedCost}
                    </span>
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
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
