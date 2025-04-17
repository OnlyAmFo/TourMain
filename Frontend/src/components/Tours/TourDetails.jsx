import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const TourDetails = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTourDetails();
  }, [id]);

  const fetchTourDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tours/${id}`);
      setTour(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch tour details");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-500">Tour not found</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{tour.name}</h1>
            <p className="text-gray-600 text-lg mb-6">{tour.description}</p>

            <div className="flex justify-between items-center mb-6">
              <span className="text-2xl font-bold text-blue-500">
                {tour.price}
              </span>
              <span className="text-gray-500 text-lg">{tour.duration}</span>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Itinerary</h2>
              <ul className="space-y-3">
                {tour.itinerary.map((day, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{day}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">What's Included</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tour.includes.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Best For</h2>
              <div className="flex flex-wrap gap-2">
                {tour.bestFor.map((category, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                className="bg-blue-500 text-white py-3 px-8 rounded-md hover:bg-blue-600 transition duration-300 text-lg"
                onClick={() => (window.location.href = `/book-tour/${tour.id}`)}
              >
                Book This Tour
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;
