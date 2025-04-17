import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { adminService } from "../../../services/admin";
import { notify } from "../../../utils/notifications";
import AddPlaceModal from "./AddPlaceModal";

const PlacesManagement = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const data = await adminService.getPlaces();
      setPlaces(data);
      setLoading(false);
    } catch (error) {
      notify.error("Failed to fetch places");
      setLoading(false);
    }
  };

  const handleDelete = async (placeId) => {
    if (window.confirm("Are you sure you want to delete this place?")) {
      try {
        await adminService.deletePlace(placeId);
        notify.success("Place deleted successfully");
        fetchPlaces();
      } catch (error) {
        notify.error("Failed to delete place");
      }
    }
  };

  const filteredPlaces = places.filter((place) =>
    place.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Places Management
        </h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search places..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <FaPlus />
            <span>Add Place</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Place
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPlaces.map((place) => {
                  return (
                    <tr key={place._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          <img
                            src={place.image || place.images?.[0]}
                            alt={place.title}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {place.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          ${place.pricePerDay || place.price}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            place.available
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {place.available ? "Available" : "Not Available"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <button className="text-blue-600 hover:text-blue-700">
                            <FaEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(place._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FaTrash className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAddModal && (
        <AddPlaceModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchPlaces();
          }}
        />
      )}
    </div>
  );
};

export default PlacesManagement;
