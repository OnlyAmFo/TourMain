import React, { useEffect, useRef } from "react";
import { FaTimes, FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";

const ShareModal = ({ isOpen, onClose, url, title }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  };

  const handleShare = (platform) => {
    try {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Share this page</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <div className="flex justify-center space-x-6">
          <button
            onClick={() => handleShare("facebook")}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            <FaFacebook size={24} />
          </button>
          <button
            onClick={() => handleShare("twitter")}
            className="p-3 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors"
          >
            <FaTwitter size={24} />
          </button>
          <button
            onClick={() => handleShare("whatsapp")}
            className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          >
            <FaWhatsapp size={24} />
          </button>
        </div>

        <div className="mt-4">
          <input
            type="text"
            value={url}
            readOnly
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
