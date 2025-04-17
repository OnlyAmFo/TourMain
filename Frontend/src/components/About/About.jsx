import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaRoute,
  FaUsers,
  FaMountain,
  FaAward,
  FaBook,
  FaEnvelope,
} from "react-icons/fa";
import aboutImage from "../../assets/about/travel-cover1.png";
import teamImage1 from "../../assets/team/18.jpg";
import teamImage2 from "../../assets/team/19.jpg";
import teamImage3 from "../../assets/team/22.jpg";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = [
    {
      icon: <FaRoute className="text-4xl text-emerald-500" />,
      number: "100+",
      label: "Trek Routes",
      description: "Curated hiking and trekking experiences",
    },
    {
      icon: <FaUsers className="text-4xl text-blue-500" />,
      number: "10k+",
      label: "Happy Trekkers",
      description: "Satisfied adventurers from around the world",
    },
    {
      icon: <FaMountain className="text-4xl text-indigo-500" />,
      number: "15+",
      label: "Years Experience",
      description: "Professional mountain guiding expertise",
    },
    {
      icon: <FaAward className="text-4xl text-purple-500" />,
      number: "50+",
      label: "Awards",
      description: "Recognition for excellence in adventure tourism",
    },
  ];

  const team = [
    {
      name: "Pasang Sherpa",
      role: "Lead Mountain Guide",
      image: teamImage1,
      experience: "20+ years of mountaineering",
      description:
        "Expert in high-altitude expeditions with multiple Everest summits",
    },
    {
      name: "Maya Gurung",
      role: "Trek Coordinator",
      image: teamImage2,
      experience: "15+ years in trek planning",
      description: "Specializes in customizing perfect trek experiences",
    },
    {
      name: "Pemba Dorje",
      role: "Safety Manager",
      image: teamImage3,
      experience: "12+ years in mountain rescue",
      description: "Certified wilderness first responder and safety expert",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen pt-28 pb-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="container mx-auto px-4"
        >
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
              >
                Your Gateway to Himalayan Adventures
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed"
              >
                Since 2008, Trek Kings has been crafting unforgettable mountain
                experiences in Nepal. We combine local expertise with
                international safety standards to provide you with the best
                trekking adventures in the Himalayas.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                <button
                  onClick={() => navigate("/best-places")}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-emerald-500/30 flex items-center gap-2"
                >
                  <FaMountain className="text-lg" />
                  Our Treks
                </button>
                <button
                  onClick={() => navigate("/blogs")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-blue-500/30 flex items-center gap-2"
                >
                  <FaBook className="text-lg" />
                  Travel Stories
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="px-6 py-3 border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-600 hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  <FaEnvelope className="text-lg" />
                  Contact Us
                </button>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <img
                src={aboutImage}
                alt="Mountain Trekking"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl text-center hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </h3>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {stat.label}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Expert Team
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our experienced guides and staff are the backbone of Trek Kings,
              ensuring your safety and enjoyment throughout your journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {member.experience}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    {member.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-emerald-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
              To provide safe, sustainable, and unforgettable trekking
              experiences while preserving Nepal's natural beauty and supporting
              local communities. We strive to exceed expectations through
              personalized service and professional expertise.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4 flex-wrap">
              <div className="px-6 py-3 bg-white dark:bg-gray-700 rounded-lg shadow-md w-full md:w-auto">
                <h3 className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Safety First
                </h3>
              </div>
              <div className="px-6 py-3 bg-white dark:bg-gray-700 rounded-lg shadow-md w-full md:w-auto">
                <h3 className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Sustainable Tourism
                </h3>
              </div>
              <div className="px-6 py-3 bg-white dark:bg-gray-700 rounded-lg shadow-md w-full md:w-auto">
                <h3 className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Local Expertise
                </h3>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
