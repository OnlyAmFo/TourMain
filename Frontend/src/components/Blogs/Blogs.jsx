import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCalendar, FaUser, FaClock, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Img1 from "../../assets/places/5.jpg";
import Img2 from "../../assets/places/6.jpg";
import Img3 from "../../assets/places/7.jpg";
import Img4 from "../../assets/places/8.jpg";
import Img5 from "../../assets/places/9.jpg";
import Img6 from "../../assets/places/10.jpg";
import { blogPosts } from "./blogData";

const Blogs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Posts" },
    { id: "trekking", name: "Trekking Tips" },
    { id: "culture", name: "Culture & Traditions" },
    { id: "gear", name: "Gear Reviews" },
    { id: "stories", name: "Travel Stories" },
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
            Trek Kings Blog
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Discover trekking tips, cultural insights, and inspiring stories
            from the Himalayas
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
            <div className="relative w-full md:w-96">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-colors duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 w-full md:w-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-emerald-600 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-600"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => navigate(`/blogs/${post.id}`)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-full">
                    {categories.find((c) => c.id === post.category)?.name}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-4">
                  <div className="flex items-center">
                    <FaUser className="mr-2" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <FaCalendar className="mr-2" />
                    {post.date}
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-2" />
                    {post.readTime}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No blog posts found matching your criteria.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
