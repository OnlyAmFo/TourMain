import React, { useState } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  const contactInfo = [
    {
      icon: <FaPhone className="text-3xl text-emerald-500" />,
      title: "Call Us",
      details: ["+977 9876543210", "+977 9876543211"],
      action: "tel:+9779876543210",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      hoverEffect: "hover:bg-emerald-100 dark:hover:bg-emerald-900/30",
    },
    {
      icon: <FaWhatsapp className="text-3xl text-green-500" />,
      title: "WhatsApp",
      details: ["+977 9876543210", "Available 24/7"],
      action: "https://wa.me/9779876543210",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      hoverEffect: "hover:bg-green-100 dark:hover:bg-green-900/30",
    },
    {
      icon: <FaEnvelope className="text-3xl text-blue-500" />,
      title: "Email Us",
      details: ["info@trekkings.com", "support@trekkings.com"],
      action: "mailto:info@trekkings.com",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      hoverEffect: "hover:bg-blue-100 dark:hover:bg-blue-900/30",
    },
    {
      icon: <FaMapMarkerAlt className="text-3xl text-red-500" />,
      title: "Visit Us",
      details: ["Thamel, Kathmandu", "Nepal"],
      action: "https://maps.google.com/?q=Thamel,Kathmandu",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      hoverEffect: "hover:bg-red-100 dark:hover:bg-red-900/30",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block"
            >
              <h2 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tracking-wide uppercase mb-2">
                Contact Us
              </h2>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                Get in Touch
              </h1>
              <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full mb-4"></div>
            </motion.div>
            <motion.p
              className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Have questions about our treks? Our team is here to help you plan
              your perfect adventure.
            </motion.p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <motion.a
                key={info.title}
                href={info.action}
                target="_blank"
                rel="noopener noreferrer"
                className={`${info.bgColor} ${info.hoverEffect} rounded-xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-lg`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 rounded-full bg-white dark:bg-gray-800 shadow-md">
                    {info.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {info.title}
                  </h3>
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-gray-600 dark:text-gray-300">
                      {detail}
                    </p>
                  ))}
                </div>
              </motion.a>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              Send us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-colors duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-colors duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-colors duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Your Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-colors duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                ></textarea>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-emerald-500/30"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </div>
            </form>

            {/* Status Messages */}
            {submitStatus && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-lg text-center ${
                  submitStatus === "success"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                }`}
              >
                {submitStatus === "success" ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Message sent successfully!
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Failed to send message. Please try again.
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
