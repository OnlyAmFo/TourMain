import React, { useState, useEffect, useRef } from "react";
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
  const userMenuRef = useRef(null);

  const darkRoutes = new Set(["/"]);
  const needsDarkNavbar = () => {
    return darkRoutes.has(location.pathname) && !isScrolled;
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
    setShowUserMenu(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const getNavbarStyle = () => {
    if (isScrolled) {
      return isDarkMode
        ? "bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-700"
        : "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200";
    }
    return "bg-transparent";
  };

  const navLinkClasses = (isActive = false) => {
    const base = "transition-colors duration-200";
    const useLightText = isDarkMode || needsDarkNavbar();

    if (useLightText) {
      return `${base} ${isActive ? "text-emerald-400" : "text-white hover:text-emerald-400"}`;
    }

    return `${base} ${isActive ? "text-emerald-600" : "text-gray-900 hover:text-emerald-600"}`;
  };

  const buttonTextClass = isDarkMode || needsDarkNavbar()
    ? "text-white hover:text-emerald-400"
    : "text-gray-900 hover:text-emerald-600";

  const brandTextClass = isDarkMode || needsDarkNavbar()
    ? "text-white"
    : "text-gray-900 dark:text-white";

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${getNavbarStyle()}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3">
              <FaMountain className="text-2xl text-emerald-600" />
              <span
                className={`text-xl font-bold tracking-tight ${brandTextClass}`}
              >
                Tour Kings
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={navLinkClasses(location.pathname === link.path)}
                >
                  {link.label}
                </Link>
              ))}

              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full transition-colors ${buttonTextClass}`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <FaSun className="text-yellow-500" />
                ) : (
                  <FaMoon className="text-gray-700" />
                )}
              </button>

              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center space-x-2 ${buttonTextClass}`}
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
                          to={user?.role === "admin" ? "/admin" : "/dashboard"}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {user?.role === "admin" ? "Admin Dashboard" : "Dashboard"}
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
                    className={`${buttonTextClass} font-medium`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className={`rounded-md bg-emerald-600 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-700`}
                  >
                    Register
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-full p-2 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 md:hidden"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

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
                      className={navLinkClasses(location.pathname === link.path)}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}

                  <button
                    onClick={toggleDarkMode}
                    className={`flex items-center ${buttonTextClass}`}
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

                  {user ? (
                    <>
                      <Link
                        to={user?.role === "admin" ? "/admin" : "/dashboard"}
                        className={buttonTextClass}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className={buttonTextClass}
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
                        className={`${buttonTextClass} text-left`}
                      >
                        Login
                      </button>
                      <button
                        onClick={() => {
                          setShowRegisterModal(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="rounded-md bg-emerald-600 px-4 py-2 text-left text-white transition-colors hover:bg-emerald-700"
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
      </nav>

      <AnimatePresence>
        {showLoginModal && <Login onClose={() => setShowLoginModal(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showRegisterModal && (
          <Register onClose={() => setShowRegisterModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
