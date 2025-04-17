import React from "react";
import { FaUsers, FaBookmark, FaDollarSign, FaStar } from "react-icons/fa";

const StatsCard = ({ icon, title, value, change, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      <span
        className={`text-sm font-medium ${
          change >= 0
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }`}
      >
        {change >= 0 ? "+" : ""}
        {change}%
      </span>
    </div>
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
      {value}
    </h3>
    <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
  </div>
);

const QuickStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        icon={<FaUsers className="w-6 h-6 text-blue-600" />}
        title="Total Users"
        value={stats.totalUsers}
        change={12}
        color="bg-blue-100 dark:bg-blue-900/30"
      />
      <StatsCard
        icon={<FaBookmark className="w-6 h-6 text-emerald-600" />}
        title="Total Bookings"
        value={stats.totalBookings}
        change={8}
        color="bg-emerald-100 dark:bg-emerald-900/30"
      />
      <StatsCard
        icon={<FaDollarSign className="w-6 h-6 text-yellow-600" />}
        title="Total Revenue"
        value={`$${stats.totalRevenue.toLocaleString()}`}
        change={15}
        color="bg-yellow-100 dark:bg-yellow-900/30"
      />
      <StatsCard
        icon={<FaStar className="w-6 h-6 text-purple-600" />}
        title="Avg. Rating"
        value="4.8"
        change={3}
        color="bg-purple-100 dark:bg-purple-900/30"
      />
    </div>
  );
};

export default QuickStats;
