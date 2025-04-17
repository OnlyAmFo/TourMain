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
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  // Determine navbar background style
  const getNavbarStyle = () => {
    if (needsDarkNavbar() || isScrolled) {
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
            <FaMountain
              className={`text-2xl ${
                needsDarkNavbar() ||
                isScrolled ||
                location.pathname.startsWith("/admin")
                  ? "text-emerald-600"
                  : "text-white drop-shadow-lg"
              }`}
            />
            <span
              className={`text-xl font-bold tracking-tight ${
                needsDarkNavbar() ||
                isScrolled ||
                location.pathname.startsWith("/admin")
                  ? "bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent"
                  : "text-white drop-shadow-lg"
              }`}
            >
              Tour Kings
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${
                  needsDarkNavbar() ||
                  isScrolled ||
                  location.pathname.startsWith("/admin")
                    ? "text-gray-800 hover:text-emerald-600 dark:text-gray-200 dark:hover:text-emerald-400"
                    : "text-white hover:text-emerald-400 drop-shadow-lg"
                } transition-colors`}
              >
                {link.label}
              </Link>
            ))}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${
                needsDarkNavbar() || isScrolled
                  ? "hover:bg-gray-100 dark:hover:bg-gray-800"
                  : "text-white hover:text-emerald-400"
              }`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <FaSun className="text-xl text-yellow-500" />
              ) : (
                <FaMoon className="text-xl" />
              )}
            </button>

            {/* Auth Buttons or User Menu */}
            {user ? (
              <div className="relative group">
                <button
                  className={`flex items-center space-x-2 text-sm font-medium tracking-wide ${
                    needsDarkNavbar() ||
                    isScrolled ||
                    location.pathname.startsWith("/admin")
                      ? "text-gray-800 dark:text-gray-200 hover:text-emerald-600"
                      : "text-white hover:text-emerald-400 drop-shadow-lg"
                  }`}
                >
                  <FaUser className="text-lg" />
                  <span>{user.name}</span>
                  <FaChevronDown
                    className={`transition-transform duration-200 group-hover:rotate-180`}
                  />
                </button>

                {/* User Dropdown Menu - Remove theme toggle */}
                <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 transition-all duration-200">
                  {user && user.role === "admin" ? (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className={`px-4 py-2 text-sm font-medium tracking-wide transition-all duration-200 rounded-lg ${
                    needsDarkNavbar() || isScrolled
                      ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                      : "text-white hover:text-emerald-400 drop-shadow-lg"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="px-4 py-2 text-sm font-medium tracking-wide bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-emerald-500/20"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden ${
              needsDarkNavbar() || isScrolled
                ? "text-gray-700 dark:text-gray-200"
                : "text-white"
            }`}
          >
            {isMobileMenuOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="py-4 space-y-2 px-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-2 px-4 text-sm font-medium tracking-wide rounded-lg transition-colors duration-200 ${
                      location.pathname === link.path
                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                        : "text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {!user ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="block w-full px-4 py-2 text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => setShowRegisterModal(true)}
                      className="block w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Sign Up
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {user && user.role === "admin" ? (
                      <Link
                        to="/admin"
                        className="block py-2 text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400"
                      >
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/dashboard"
                        className="block py-2 text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400"
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left py-2 text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Auth Modals */}
      {showLoginModal && <Login onClose={() => setShowLoginModal(false)} />}
      {showRegisterModal && (
        <Register onClose={() => setShowRegisterModal(false)} />
      )}
    </nav>
  );
};

export default Navbar;
