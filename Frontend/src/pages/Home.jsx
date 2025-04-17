import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaMountain,
  FaMapMarkedAlt,
  FaUserFriends,
  FaAward,
} from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import heroVideo from "../assets/video/main.mp4";

const Home = () => {
  const navigate = useNavigate();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const stats = [
    {
      icon: <FaMountain className="text-4xl text-emerald-500" />,
      number: "50+",
      label: "Trek Routes",
      description: "Curated hiking experiences",
    },
    {
      icon: <FaMapMarkedAlt className="text-4xl text-blue-500" />,
      number: "25+",
      label: "Destinations",
      description: "Unique locations",
    },
    {
      icon: <FaUserFriends className="text-4xl text-purple-500" />,
      number: "10k+",
      label: "Happy Trekkers",
      description: "Satisfied adventurers",
    },
    {
      icon: <FaAward className="text-4xl text-yellow-500" />,
      number: "15+",
      label: "Years Experience",
      description: "Professional expertise",
    },
  ];

  const features = [
    {
      title: "Expert Local Guides",
      description:
        "Experienced Sherpa guides with extensive knowledge of the trails",
    },
    {
      title: "Safety First",
      description: "Comprehensive safety measures and emergency support",
    },
    {
      title: "Small Groups",
      description: "Intimate groups for better experience and attention",
    },
    {
      title: "Sustainable Tourism",
      description: "Eco-friendly practices and community support",
    },
  ];

  const popularTreks = [
    {
      id: 1,
      name: "Everest Base Camp",
      image: "/src/assets/places/1.png",
      duration: "14 Days",
      difficulty: "Challenging",
      elevation: "5,364m",
      description:
        "The classic trek to the foot of the world's highest mountain.",
      slug: "mountain-1",
    },
    {
      id: 2,
      name: "Annapurna Circuit",
      image: "/src/assets/places/2.png",
      duration: "21 Days",
      difficulty: "Moderate",
      elevation: "5,416m",
      description: "A complete journey around the Annapurna massif.",
      slug: "mountain-2",
    },
    {
      id: 3,
      name: "Langtang Valley",
      image: "/src/assets/places/3.png",
      duration: "7 Days",
      difficulty: "Moderate",
      elevation: "3,870m",
      description:
        "The valley of glaciers, pristine forests and mountain views.",
      slug: "mountain-3",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const scaleVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setIsVideoLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-1000 ${
              isVideoLoaded ? "opacity-100" : "opacity-0"
            }`}
            src={heroVideo}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-black"
          />
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="cursor-pointer"
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight,
                behavior: "smooth",
              });
            }}
          >
            <div className="text-sm mb-2">Scroll Down</div>
            <svg
              className="w-6 h-6 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Hero Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 container mx-auto px-4 text-center text-white"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Discover the Majesty of Nepal
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
          >
            Experience unforgettable trekking adventures in the heart of the
            Himalayas
          </motion.p>
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/best-places")}
            className="bg-emerald-600 text-white px-8 py-3 rounded-full hover:bg-emerald-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <span>Explore Treks</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <FaArrowRight />
            </motion.div>
          </motion.button>
        </motion.div>
      </section>

      {/* Stats Section with Gradient Background */}
      <section className="relative py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-gray-900 pointer-events-none" />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={scaleVariants.hover}
                className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-700 shadow-lg transform-gpu"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex justify-center mb-4"
                >
                  {stat.icon}
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  {stat.number}
                </motion.h3>
                <motion.p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {stat.label}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section with Background Pattern */}
      <section className="relative py-20 bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Trek Kings?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Experience the difference with our professional service and
              dedication to excellence
            </p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={scaleVariants.hover}
                className="flex items-start space-x-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transform-gpu"
              >
                <motion.div
                  initial={{ rotate: -180, opacity: 0 }}
                  whileInView={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex-shrink-0"
                >
                  <IoMdCheckmarkCircleOutline className="text-2xl text-emerald-500" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Treks Section with Curved Divider */}
      <section className="relative py-20 bg-white dark:bg-gray-800">
        <div className="absolute top-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 0L1440 0V60C1440 93.1371 1413.14 120 1380 120H60C26.8629 120 0 93.1371 0 60V0Z"
              className="fill-gray-50 dark:fill-gray-900"
            />
          </svg>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto px-4 pt-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Treks
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover our most sought-after trekking adventures
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularTreks.map((trek, index) => (
              <motion.div
                key={trek.id}
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 },
                }}
                className="group relative overflow-hidden rounded-2xl cursor-pointer"
                onClick={() => navigate(`/places/${trek.slug}`)}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="aspect-[3/4] overflow-hidden"
                >
                  <img
                    src={trek.image}
                    alt={trek.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                >
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{trek.name}</h3>
                    <p className="text-gray-300 mb-4">{trek.description}</p>
                    <div className="flex gap-4 text-sm">
                      <span>{trek.duration}</span>
                      <span>•</span>
                      <span>{trek.elevation}</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Call to Action with Wave Background */}
      <section className="relative py-20 bg-emerald-600 overflow-hidden">
        <div className="absolute inset-0">
          <svg
            className="absolute bottom-0 left-0 w-full"
            viewBox="0 0 1440 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillOpacity="0.1"
              d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="container mx-auto px-4 text-center text-white">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <motion.h2
              variants={itemVariants}
              className="text-4xl font-bold mb-6"
            >
              Start Your Journey Today
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl mb-8">
              Let us help you plan the adventure of a lifetime in the Himalayas
            </motion.p>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.button
                onClick={() => navigate("/contact")}
                className="relative px-8 py-4 bg-white text-emerald-600 rounded-full group overflow-hidden"
                whileHover="hover"
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-emerald-100 to-emerald-200"
                  initial={{ x: "-100%" }}
                  variants={{
                    hover: {
                      x: "100%",
                      transition: {
                        duration: 0.5,
                        ease: "easeInOut",
                        repeat: Infinity,
                      },
                    },
                  }}
                />
                <motion.span
                  className="relative flex items-center justify-center space-x-2"
                  variants={{
                    hover: {
                      x: [0, 5, 0],
                      transition: {
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      },
                    },
                  }}
                >
                  <span>Plan Your Trek</span>
                  <motion.span
                    variants={{
                      hover: {
                        x: [0, 5, 0],
                        transition: {
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                          delay: 0.2,
                        },
                      },
                    }}
                  >
                    <FaArrowRight className="inline-block ml-2" />
                  </motion.span>
                </motion.span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
