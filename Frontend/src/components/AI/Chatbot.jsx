import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPaperPlane,
  FaShare,
  FaRobot,
  FaTimes,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDollarSign,
} from "react-icons/fa";
import ShareModal from "../ShareModal";
import { marked } from "marked";
import axios from "axios";
import { toast } from "react-toastify";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `👋 Welcome to Tour Assistant! I'm here to help you plan your perfect adventure in Nepal. I can:

• Suggest tours and treks based on your preferences
• Provide information about popular destinations
• Help with travel planning and recommendations
• Answer questions about Nepal's culture and attractions

What would you like to know about?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [availableTours, setAvailableTours] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchAvailableTours();
  }, []);

  const fetchAvailableTours = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tours");
      setAvailableTours(response.data);
    } catch (error) {
      console.error("Error fetching tours:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findMatchingTours = (query) => {
    const searchTerms = query.toLowerCase().split(" ");
    return availableTours.filter((tour) => {
      const tourText =
        `${tour.name} ${tour.description} ${tour.location}`.toLowerCase();
      return searchTerms.some((term) => tourText.includes(term));
    });
  };

  const generateAlternativeSuggestions = (query) => {
    const matchingTours = findMatchingTours(query);
    if (matchingTours.length === 0) {
      // Find tours with similar characteristics
      const searchTerms = query.toLowerCase().split(" ");
      const alternativeTours = availableTours.filter((tour) => {
        const tourText =
          `${tour.name} ${tour.description} ${tour.location}`.toLowerCase();
        return searchTerms.some((term) => tourText.includes(term));
      });

      if (alternativeTours.length > 0) {
        return `I couldn't find exactly what you're looking for, but here are some similar tours you might enjoy:

${alternativeTours
  .slice(0, 3)
  .map(
    (tour) => `
• ${tour.name}
  - Location: ${tour.location}
  - Duration: ${tour.duration}
  - Price: $${tour.price}
  - Highlights: ${tour.highlights?.slice(0, 2).join(", ")}`
  )
  .join("\n\n")}

Would you like to know more about any of these tours?`;
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      if (!OPENROUTER_API_KEY) {
        throw new Error("OpenRouter API key is not configured");
      }

      // Check for tour-related queries
      const tourQuery = userMessage.toLowerCase();
      if (
        tourQuery.includes("tour") ||
        tourQuery.includes("trek") ||
        tourQuery.includes("visit")
      ) {
        const matchingTours = findMatchingTours(userMessage);
        const alternativeSuggestions =
          generateAlternativeSuggestions(userMessage);

        if (matchingTours.length > 0) {
          const tourResponse = `Here are some tours that match your interests:

${matchingTours
  .slice(0, 3)
  .map(
    (tour) => `
• ${tour.name}
  - Location: ${tour.location}
  - Duration: ${tour.duration}
  - Price: $${tour.price}
  - Highlights: ${tour.highlights?.slice(0, 2).join(", ")}`
  )
  .join("\n\n")}

Would you like to know more about any of these tours?`;
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: tourResponse },
          ]);
          setIsLoading(false);
          return;
        } else if (alternativeSuggestions) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: alternativeSuggestions },
          ]);
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "TourApp",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-r1:free",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful travel assistant specializing in Nepal tourism. Provide detailed, accurate information about tours, treks, and travel in Nepal. Always suggest available tours from our database when relevant.",
              },
              ...messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
              })),
              { role: "user", content: userMessage },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content;

      if (!aiResponse) {
        throw new Error("No response received from AI");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, but I'm having trouble connecting right now. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const renderMessage = (message) => {
    if (message.role === "assistant") {
      return <div className="whitespace-pre-wrap">{message.content}</div>;
    }
    return <div>{message.content}</div>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nepal Tour Assistant
          </h1>
          <p className="text-xl text-gray-600">
            Your AI companion for planning the perfect Nepal adventure
          </p>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <FaRobot className="text-2xl text-emerald-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Tour Assistant
              </h2>
            </div>
            <button
              onClick={handleShare}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaShare />
            </button>
          </div>

          <div className="h-[600px] overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.role === "user"
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {renderMessage(message)}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-2xl p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 border-t border-gray-200"
          >
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about tours, treks, or travel in Nepal..."
                className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`p-3 rounded-xl ${
                  !input.trim() || isLoading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700"
                } text-white transition-colors`}
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={window.location.href}
        title="Check out this amazing tour assistant!"
      />
    </div>
  );
};

export default Chatbot;
