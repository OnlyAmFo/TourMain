import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaMountain,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaMoon,
  FaSun,
  FaUserCog,
  FaRobot,
  FaMapMarkedAlt,
  FaChartBar,
  FaCalendarAlt,
  FaSuitcase,
  FaHeart,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAIMenu, setShowAIMenu] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const darkRoutes = new Set([
    "/best-places",
    "/blogs",
    "/dashboard",
    "/about",
    "/contact",
  ]);
  const needsDarkNavbar = () => {
    return (
      darkRoutes.has(location.pathname) ||
      /^\/blogs\/\d+$/.test(location.pathname) ||
      /^\/places\/\d+$/.test(location.pathname)
    );
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/best-places", label: "Best Places" },
    { path: "/blogs", label: "Blogs" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
    { path: "/trek-suggester", label: "Trek Suggester" },
  ];

  const aiFeatures = [
    { path: "/chatbot", label: "AI Assistant", icon: <FaRobot /> },
    // {
    //   path: "/tour-recommender",
    //   label: "Tour Recommender",
    //   icon: <FaMapMarkedAlt />,
    // },
    {
      path: "/packing-assistant",
      label: "Smart Packing",
      icon: <FaSuitcase />,
    },
    { path: "/emotion-trips", label: "Mood Trips", icon: <FaHeart /> },
    {
      path: "/itinerary-generator",
      label: "Itinerary Generator",
      icon: <FaCalendarAlt />,
    },
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  // Determine navbar background style
  const getNavbarStyle = () => {
    if (isScrolled) {
      return "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-800";
    }
    return "bg-transparent";
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${getNavbarStyle()}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <FaMountain className="text-2xl text-emerald-600" />
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Tour Kings
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors ${
                  location.pathname === link.path
                    ? "text-emerald-600 dark:text-emerald-400"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* AI Features Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowAIMenu(!showAIMenu)}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <FaRobot />
                <span>AI Features</span>
                <FaChevronDown className="text-xs" />
              </button>
              <AnimatePresence>
                {showAIMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1"
                  >
                    {aiFeatures.map((feature) => (
                      <Link
                        key={feature.path}
                        to={feature.path}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowAIMenu(false)}
                      >
                        {feature.icon}
                        <span className="ml-2">{feature.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <FaSun className="text-yellow-500" />
              ) : (
                <FaMoon className="text-gray-700" />
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  <FaUser />
                  <span>{user.name}</span>
                  <FaChevronDown className="text-xs" />
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1"
                    >
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4"
            >
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 ${
                      location.pathname === link.path
                        ? "text-emerald-600 dark:text-emerald-400"
                        : ""
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* AI Features in Mobile Menu */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    AI Features
                  </div>
                  {aiFeatures.map((feature) => (
                    <Link
                      key={feature.path}
                      to={feature.path}
                      className="flex items-center py-2 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {feature.icon}
                      <span className="ml-2">{feature.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Theme Toggle in Mobile Menu */}
                <button
                  onClick={toggleDarkMode}
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  {isDarkMode ? (
                    <>
                      <FaSun className="mr-2" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <FaMoon className="mr-2" />
                      Dark Mode
                    </>
                  )}
                </button>

                {/* User Menu in Mobile */}
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => {
                        setShowLoginModal(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setShowRegisterModal(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && <Login onClose={() => setShowLoginModal(false)} />}
      </AnimatePresence>

      {/* Register Modal */}
      <AnimatePresence>
        {showRegisterModal && (
          <Register onClose={() => setShowRegisterModal(false)} />
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
