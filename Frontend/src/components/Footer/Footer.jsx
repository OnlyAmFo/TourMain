import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaMountain,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "About Us", path: "/about" },
      { name: "Contact", path: "/contact" },
      { name: "Blogs", path: "/blogs" },
      { name: "Best Places", path: "/best-places" },
    ],
    support: [
      { name: "FAQs", path: "/faqs" },
      { name: "Terms & Conditions", path: "/terms" },
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Cancellation Policy", path: "/cancellation" },
    ],
    contact: [
      { icon: <FaPhoneAlt />, text: "+977 9876543210" },
      { icon: <FaEnvelope />, text: "info@trekkings.com" },
      { icon: <FaMapMarkerAlt />, text: "Thamel, Kathmandu, Nepal" },
    ],
    social: [
      { icon: <FaFacebookF />, link: "#", name: "Facebook" },
      { icon: <FaTwitter />, link: "#", name: "Twitter" },
      { icon: <FaInstagram />, link: "#", name: "Instagram" },
      { icon: <FaYoutube />, link: "#", name: "YouTube" },
    ],
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <FaMountain className="text-3xl text-emerald-500" />
              <span className="text-2xl font-bold text-white">Trek Kings</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Your trusted partner for Himalayan adventures. Discover the magic
              of Nepal with our expert guides and carefully crafted treks.
            </p>
            <div className="flex gap-4">
              {footerLinks.social.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 transition-colors"
                  aria-label={item.name}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-4">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4">
              {footerLinks.contact.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span className="text-emerald-500">{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} Trek Kings. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="hover:text-emerald-400">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-emerald-400">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
