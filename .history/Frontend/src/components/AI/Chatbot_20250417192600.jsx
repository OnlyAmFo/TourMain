import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

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
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-4">
          <h2 className="text-xl font-semibold text-white">Travel Assistant</h2>
        </div>

        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 text-gray-800">
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about travel..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
