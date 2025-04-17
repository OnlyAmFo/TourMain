import React from "react";
import { IoIosCloseCircle } from "react-icons/io";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg max-w-lg w-full relative">
        {/* Close button positioned at the top right of the form */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 sm:text-lg"
          onClick={onClose}
          aria-label="Close"
        >
          <IoIosCloseCircle size={24} className="sm:w-8 sm:h-8" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
