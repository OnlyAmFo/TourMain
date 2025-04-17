import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPaperPlane, FaRobot, FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your travel assistant. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/ai/chat", {
        message: userMessage,
      });

      // Clean the response to remove any system prompts
      let botResponse = response.data.response;

      // Remove system prompts that might be included in the response
      botResponse = botResponse.replace(
        /You are a helpful travel assistant\. Your role is to.*?tone\./g,
        ""
      );
      botResponse = botResponse.replace(/User:.*?Assistant:/g, "");
      botResponse = botResponse.replace(/Customer:.*?$/g, "");

      // Clean up any remaining whitespace
      botResponse = botResponse.trim();

      // If the response is empty after cleaning, use a fallback
      if (!botResponse) {
        botResponse =
          "I'm here to help with your travel questions! What would you like to know about?";
      }

      setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to get response from AI assistant");
      setMessages((prev) => [
        ...prev,
        {
          text: "I'm sorry, I'm having trouble responding right now. Please try again later.",
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 text-gray-800 dark:text-white">
            Travel Assistant
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Ask me anything about travel, destinations, or planning your next
            adventure!
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="bg-emerald-600 p-6 flex items-center space-x-4">
            <FaRobot className="text-2xl text-white" />
            <h2 className="text-2xl font-semibold text-white">
              AI Travel Assistant
            </h2>
          </div>

          <div className="h-[600px] overflow-y-auto p-6 space-y-6">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex items-start space-x-3 max-w-[80%]">
                    {message.sender === "bot" && (
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center flex-shrink-0">
                        <FaRobot className="text-emerald-600 dark:text-emerald-400" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl p-4 ${
                        message.sender === "user"
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {message.text}
                    </div>
                    {message.sender === "user" && (
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center flex-shrink-0">
                        <FaUser className="text-emerald-600 dark:text-emerald-400" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <FaRobot className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-400 dark:bg-emerald-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-emerald-400 dark:bg-emerald-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-emerald-400 dark:bg-emerald-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about travel..."
                className="flex-1 p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 text-white px-6 py-4 rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 transition-colors flex items-center space-x-2"
              >
                <span>Send</span>
                <FaPaperPlane className="text-sm" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
