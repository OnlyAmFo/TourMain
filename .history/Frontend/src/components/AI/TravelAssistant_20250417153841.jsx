import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TravelAssistant = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage("");
    setLoading(true);

    // Add user message to chat history
    setChatHistory((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const response = await axios.post("http://localhost:5000/api/ai/chat", {
        message: userMessage,
      });

      // Add AI response to chat history
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: response.data.message },
      ]);
    } catch (error) {
      toast.error("Failed to get response from AI assistant");
      console.error("AI Assistant Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              AI Travel Assistant
            </h2>
            <p className="text-gray-600 mb-6">
              Ask me anything about travel recommendations, trip planning, or
              local insights!
            </p>

            {/* Chat History */}
            <div className="space-y-4 mb-6 h-96 overflow-y-auto">
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`flex ${
                    chat.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-sm rounded-lg px-4 py-2 ${
                      chat.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{chat.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelAssistant;
