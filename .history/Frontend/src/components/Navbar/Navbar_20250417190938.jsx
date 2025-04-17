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
    { path: "/tours", label: "Tours" },
    { path: "/trek-suggester", label: "Trek Suggester" },
    { path: "/chatbot", label: "AI Assistant" },
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
                    className={`text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors ${
                      location.pathname === link.path
                        ? "text-emerald-600 dark:text-emerald-400"
                        : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={toggleDarkMode}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  {isDarkMode ? (
                    <>
                      <FaSun className="text-yellow-500" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <FaMoon className="text-gray-700" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
                {user ? (
                  <div className="flex flex-col space-y-2">
                    <Link
                      to="/dashboard"
                      className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
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
