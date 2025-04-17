import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    interests: [],
    privacySettings: {
      showContactInfo: false,
      showEmail: false,
      showPhone: false,
      allowMessages: true,
      showInSearch: true,
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProfile(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load profile");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePrivacyChange = (setting) => {
    setProfile((prev) => ({
      ...prev,
      privacySettings: {
        ...prev.privacySettings,
        [setting]: !prev.privacySettings[setting],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put("http://localhost:5000/api/users/profile", profile, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Profile updated successfully");
      setSaving(false);
    } catch (error) {
      toast.error("Failed to update profile");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleInputChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">
                  Show Contact Information
                </h3>
                <p className="text-sm text-gray-500">
                  Allow others to see your contact details
                </p>
              </div>
              <button
                type="button"
                onClick={() => handlePrivacyChange("showContactInfo")}
                className={`${
                  profile.privacySettings.showContactInfo
                    ? "bg-blue-600"
                    : "bg-gray-200"
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
              >
                <span
                  className={`${
                    profile.privacySettings.showContactInfo
                      ? "translate-x-5"
                      : "translate-x-0"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1 ml-1`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">
                  Allow Messages
                </h3>
                <p className="text-sm text-gray-500">
                  Let other users send you messages
                </p>
              </div>
              <button
                type="button"
                onClick={() => handlePrivacyChange("allowMessages")}
                className={`${
                  profile.privacySettings.allowMessages
                    ? "bg-blue-600"
                    : "bg-gray-200"
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
              >
                <span
                  className={`${
                    profile.privacySettings.allowMessages
                      ? "translate-x-5"
                      : "translate-x-0"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1 ml-1`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">
                  Show in Search Results
                </h3>
                <p className="text-sm text-gray-500">
                  Allow your profile to appear in search results
                </p>
              </div>
              <button
                type="button"
                onClick={() => handlePrivacyChange("showInSearch")}
                className={`${
                  profile.privacySettings.showInSearch
                    ? "bg-blue-600"
                    : "bg-gray-200"
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
              >
                <span
                  className={`${
                    profile.privacySettings.showInSearch
                      ? "translate-x-5"
                      : "translate-x-0"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1 ml-1`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
