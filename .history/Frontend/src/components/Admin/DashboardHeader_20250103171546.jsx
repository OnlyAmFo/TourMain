import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaSearch, FaUser, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const DashboardHeader = ({ user }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 h-16 fixed right-0 left-0 lg:left-72 top-16 z-10 border-b border-gray-200 dark:border-gray-700">
        <div className="h-full px-4 md:px-8 flex items-center justify-between">
          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center flex-1 max-w-xl">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white text-sm"
              />
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <FaSearch className="w-5 h-5" />
          </button>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <FaBell className="w-5 h-5 md:w-6 md:h-6" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 focus:outline-none group"
              >
                <div className="relative">
                  <img
                    src={
                      user?.avatar ||
                      "https://ui-avatars.com/api/?name=" + user?.name
                    }
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-emerald-500 transition-all"
                  />
                  <div className="absolute inset-0 rounded-full shadow-inner"></div>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-700 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Administrator
                  </p>
                </div>
                <FaChevronDown
                  className={`hidden md:block w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-200 dark:border-gray-700"
                  >
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Profile
                    </a>
                    <a
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Settings
                    </a>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <button
                      onClick={() => {
                        // Handle logout
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed top-32 left-0 right-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white text-sm"
                autoFocus
              />
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardHeader;
