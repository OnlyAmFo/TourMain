import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaStar,
  FaChartBar,
  FaThumbsUp,
  FaComments,
  FaExclamationTriangle,
} from "react-icons/fa";

const ReviewAnalyzer = () => {
  const [reviews, setReviews] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
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
                  "You are an expert at analyzing tour reviews and providing insights.",
              },
              {
                role: "user",
                content: `Analyze these tour reviews and provide insights in the following format:
                Overall Sentiment: [positive/negative/neutral]
                Key Strengths:
                - [List 3 main positive points]
                Key Areas for Improvement:
                - [List 3 main areas that need attention]
                Common Themes:
                - [List 3 most mentioned aspects]
                Recommendations:
                - [List 3 actionable recommendations]

                Reviews to analyze:
                ${reviews}`,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content;

      // Parse the AI response into structured analysis
      const parsedAnalysis = parseAIResponse(aiResponse);
      setAnalysis(parsedAnalysis);
    } catch (error) {
      console.error("Error analyzing reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const parseAIResponse = (response) => {
    const sections = response.split("\n\n");
    const analysis = {
      sentiment: "",
      strengths: [],
      improvements: [],
      themes: [],
      recommendations: [],
    };

    sections.forEach((section) => {
      if (section.startsWith("Overall Sentiment:")) {
        analysis.sentiment = section.split(":")[1].trim();
      } else if (section.startsWith("Key Strengths:")) {
        analysis.strengths = section
          .split("\n")
          .slice(1)
          .map((item) => item.trim().replace("- ", ""));
      } else if (section.startsWith("Key Areas for Improvement:")) {
        analysis.improvements = section
          .split("\n")
          .slice(1)
          .map((item) => item.trim().replace("- ", ""));
      } else if (section.startsWith("Common Themes:")) {
        analysis.themes = section
          .split("\n")
          .slice(1)
          .map((item) => item.trim().replace("- ", ""));
      } else if (section.startsWith("Recommendations:")) {
        analysis.recommendations = section
          .split("\n")
          .slice(1)
          .map((item) => item.trim().replace("- ", ""));
      }
    });

    return analysis;
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Review Analyzer
          </h1>
          <p className="text-xl text-gray-600">
            Get insights from tour reviews using AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Review Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-xl p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste Tour Reviews
                </label>
                <textarea
                  value={reviews}
                  onChange={(e) => setReviews(e.target.value)}
                  rows="10"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Paste multiple reviews here, one per line..."
                />
              </div>

              <button
                type="submit"
                disabled={loading || !reviews.trim()}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? "Analyzing Reviews..." : "Analyze Reviews"}
              </button>
            </form>
          </motion.div>

          {/* Analysis Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-xl p-6"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Analysis Results
            </h2>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : analysis ? (
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Overall Sentiment
                  </h3>
                  <p
                    className={`text-xl font-bold ${getSentimentColor(analysis.sentiment)}`}
                  >
                    {analysis.sentiment}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <FaThumbsUp className="mr-2 text-green-500" />
                    Key Strengths
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis.strengths.map((strength, index) => (
                      <li key={index} className="text-gray-600">
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <FaExclamationTriangle className="mr-2 text-yellow-500" />
                    Areas for Improvement
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis.improvements.map((improvement, index) => (
                      <li key={index} className="text-gray-600">
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <FaComments className="mr-2 text-blue-500" />
                    Common Themes
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis.themes.map((theme, index) => (
                      <li key={index} className="text-gray-600">
                        {theme}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <FaChartBar className="mr-2 text-purple-500" />
                    Recommendations
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis.recommendations.map((recommendation, index) => (
                      <li key={index} className="text-gray-600">
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <FaStar className="mx-auto h-12 w-12 mb-4" />
                <p>Paste tour reviews to get AI-powered insights</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReviewAnalyzer;
