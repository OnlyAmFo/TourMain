import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/bookings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setBookings(response.data);
      } catch (error) {
        toast.error("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              User Profile
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Personal details and tour bookings.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Email address
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Your Bookings
          </h3>
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No bookings found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <h4 className="text-lg font-medium text-gray-900">
                      {booking.tour.name}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      {booking.tour.description}
                    </p>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Booking Date:{" "}
                        {new Date(booking.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Status: {booking.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
