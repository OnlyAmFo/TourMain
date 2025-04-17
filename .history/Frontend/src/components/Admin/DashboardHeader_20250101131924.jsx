import React from "react";
import { FaBell, FaSearch } from "react-icons/fa";

const DashboardHeader = ({ user }) => {
  return (
    <div className="bg-white dark:bg-gray-800 h-16 fixed right-0 left-72 top-16 z-10 border-b border-gray-200 dark:border-gray-700 px-8 flex items-center justify-between">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
          <FaBell className="w-6 h-6" />
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            3
          </span>
        </button>
        <div className="flex items-center space-x-3">
          <img
            src={
              user?.avatar || "https://ui-avatars.com/api/?name=" + user?.name
            }
            alt="Profile"
            className="h-8 w-8 rounded-full object-cover"
          />
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-700 dark:text-white">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
