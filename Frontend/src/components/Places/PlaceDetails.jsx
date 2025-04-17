import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import BookingForm from "../Booking/BookingForm";
import { notify } from "../../utils/notifications";

const PlaceDetails = ({ place }) => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const { user } = useAuth();

  const handleBookingSuccess = (booking) => {
    notify.success("Booking created successfully!");
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-64">
        <img
          src={place.images[0]}
          alt={place.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{place.title}</h2>
        <p className="text-gray-600 mb-4">{place.description}</p>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-gray-600">Location</p>
            <p className="font-medium">{place.location}</p>
          </div>
          <div>
            <p className="text-gray-600">Price per day</p>
            <p className="font-medium">${place.pricePerDay}</p>
          </div>
          <div>
            <p className="text-gray-600">Max Group Size</p>
            <p className="font-medium">{place.maxGroupSize} people</p>
          </div>
        </div>

        {user ? (
          <button
            onClick={() => setShowBookingForm(true)}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Book Now
          </button>
        ) : (
          <p className="text-center text-gray-600">
            Please login to book this place
          </p>
        )}

        {/* Reviews Section */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Reviews</h3>
          {place.reviews && place.reviews.length > 0 ? (
            <div className="space-y-4">
              {place.reviews.map((review) => (
                <div key={review._id} className="border-b pb-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{review.user.name}</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <span
                          key={index}
                          className={`text-xl ${
                            index < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">{review.comment}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No reviews yet</p>
          )}
        </div>
      </div>

      {showBookingForm && (
        <BookingForm
          place={place}
          onClose={() => setShowBookingForm(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default PlaceDetails;
