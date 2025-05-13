import React from "react";

const Footer = () => (
  <footer className="bg-gray-900 text-gray-200 py-6">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
      <div className="text-sm">
        &copy; {new Date().getFullYear()} Tour Kings. All rights reserved.
      </div>
      <div className="flex space-x-4 mt-2 md:mt-0">
        <a href="/about" className="hover:underline">
          About
        </a>
        <a href="/contact" className="hover:underline">
          Contact
        </a>
        <a href="/privacy" className="hover:underline">
          Privacy Policy
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
