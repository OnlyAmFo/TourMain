import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TourSuggestions = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    duration: "",
    budget: "",
    interests: [],
    travelStyle: "",
  });

  const interestOptions = [
    "Adventure seekers",
    "Nature lovers",
    "Cultural enthusiasts",
    "Spiritual seekers",
    "Photography lovers",
    "Active travelers",
    "Peace lovers",
  ];

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tours");
      setTours(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch tours");
      setLoading(false);
    }
  };

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
    try {
      const response = await axios.post(
        "http://localhost:5000/api/tours/recommendations",
        {
          preferences,
        }
      );
      setTours(response.data.tours);
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Failed to get recommendations");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">
        Find Your Perfect Tour
      </h2>

      {/* Preferences Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Duration (days)
              </label>
              <input
                type="number"
                name="duration"
                value={preferences.duration}
                onChange={handlePreferenceChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., 7"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Budget ($)
              </label>
              <input
                type="number"
                name="budget"
                value={preferences.budget}
                onChange={handlePreferenceChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., 1000"
              />
            </div>
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Travel Style
            </label>
            <select
              name="travelStyle"
              value={preferences.travelStyle}
              onChange={handlePreferenceChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select travel style</option>
              <option value="Relaxed">Relaxed</option>
              <option value="Active">Active</option>
              <option value="Adventure">Adventure</option>
              <option value="Cultural">Cultural</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Find Tours
          </button>
        </form>
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <div
            key={tour.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{tour.name}</h3>
              <p className="text-gray-600 mb-4">{tour.description}</p>

              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-blue-500">
                  {tour.price}
                </span>
                <span className="text-gray-500">{tour.duration}</span>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Highlights:</h4>
                <ul className="list-disc list-inside text-gray-600">
                  {tour.itinerary.slice(0, 3).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {tour.bestFor.map((category, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                  >
                    {category}
                  </span>
                ))}
              </div>

              <button
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                onClick={() => (window.location.href = `/tours/${tour.id}`)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourSuggestions;
