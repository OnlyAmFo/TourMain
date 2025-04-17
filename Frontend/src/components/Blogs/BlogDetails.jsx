import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCalendar, FaUser, FaClock, FaArrowLeft } from "react-icons/fa";
import { blogPosts } from "./blogData"; // We'll create this in step 2

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const blogPost = blogPosts.find((post) => post.id === parseInt(id));
    if (blogPost) {
      setPost(blogPost);
      window.scrollTo(0, 0);
    } else {
      navigate("/blogs"); // Redirect if blog not found
    }
  }, [id, navigate]);

  if (!post) return null;

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto"
        >
          {/* Back Button */}
          <button
            onClick={() => navigate("/blogs")}
            className="flex items-center text-emerald-600 hover:text-emerald-700 mb-8 group"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Blogs
          </button>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden mb-8 shadow-xl"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-[400px] object-cover"
            />
          </motion.div>

          {/* Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
            {/* Category Tag */}
            <div className="mb-4">
              <span className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-medium">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center text-gray-600 dark:text-gray-400 gap-6 mb-8 text-sm">
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

            {/* Blog Content */}
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {post.content}
              </p>

              {/* Add more content sections as needed */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                Key Takeaways
              </h2>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6">
                {post.keyPoints?.map((point, index) => (
                  <li key={index} className="mb-2">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogDetails;
