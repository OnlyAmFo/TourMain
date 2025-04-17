import React, { useState, useMemo } from "react";
import PlaceCard from "./PlaceCard";
import { motion } from "framer-motion";
import {
  FaSort,
  FaFilter,
  FaSearch,
  FaMountain,
  FaMapMarkedAlt,
} from "react-icons/fa";
import Img1 from "../../assets/places/5.jpg";
import Img2 from "../../assets/places/6.jpg";
import Img3 from "../../assets/places/7.jpg";
import Img4 from "../../assets/places/8.jpg";
import Img5 from "../../assets/places/9.jpg";
import Img6 from "../../assets/places/10.jpg";

const PlacesData = [
  {
    _id: "place1",
    img: Img1,
    title: "Everest Base Camp",
    location: "Khumbu, Nepal",
    description:
      "The classic trek to the foot of the world's highest mountain.",
    price: 6700,
    type: "Cultural Relax",
    difficulty: "challenging",
    duration: "14-16 days",
    altitude: "5,364m",
    bestSeason: "Mar-May, Sep-Nov",
    link: "/places/mountain-1",
    maxGroupSize: 12,
    pricePerDay: 250,
    images: [Img1],
  },
  {
    _id: "place2",
    img: Img2,
    title: "Annapurna Circuit",
    location: "Annapurna, Nepal",
    description: "A complete journey around the Annapurna massif.",
    price: 5500,
    type: "Cultural Relax",
    difficulty: "moderate",
    duration: "12-14 days",
    altitude: "5,416m",
    bestSeason: "Oct-Nov, Mar-Apr",
    link: "/places/mountain-2",
    maxGroupSize: 10,
    pricePerDay: 200,
    images: [Img2],
  },
  {
    _id: "place3",
    img: Img3,
    title: "Langtang Valley",
    location: "Langtang, Nepal",
    description: "The valley of glaciers, pristine forests and mountain views.",
    price: 4200,
    type: "Adventure",
    difficulty: "moderate",
    duration: "7-9 days",
    altitude: "4,984m",
    bestSeason: "Mar-May, Sep-Dec",
    link: "/places/mountain-3",
    maxGroupSize: 8,
    pricePerDay: 180,
    images: [Img3],
  },
  {
    _id: "place4",
    img: Img4,
    title: "Manaslu Circuit",
    location: "Manaslu, Nepal",
    description: "Experience one of Nepal's most authentic treks.",
    price: 5800,
    type: "Adventure",
    difficulty: "challenging",
    duration: "14-16 days",
    link: "/places/mountain-4",
    maxGroupSize: 10,
    pricePerDay: 220,
    altitude: "5,160m",
    bestSeason: "Mar-May, Sep-Nov",
    images: [Img4],
  },
  {
    _id: "place5",
    img: Img5,
    title: "Upper Mustang",
    location: "Mustang, Nepal",
    description: "Journey into the hidden kingdom of Lo.",
    price: 7200,
    type: "Cultural",
    difficulty: "easy",
    duration: "10-12 days",
    link: "/places/mountain-5",
    altitude: "3,840m",
    bestSeason: "Jun-Aug",
    maxGroupSize: 8,
    pricePerDay: 300,
    images: [Img5],
  },
  {
    _id: "place6",
    img: Img6,
    title: "Gokyo Lakes",
    location: "Khumbu, Nepal",
    description: "Visit the stunning turquoise lakes of Gokyo.",
    price: 5900,
    type: "Adventure",
    difficulty: "moderate",
    duration: "12-14 days",
    link: "/places/mountain-6",
    altitude: "5,357m",
    bestSeason: "Mar-May, Sep-Nov",
    maxGroupSize: 10,
    pricePerDay: 230,
    images: [Img6],
  },
];

const Places = ({ limit, excludeLink, randomize }) => {
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter and sort places
  const displayedPlaces = useMemo(() => {
    let filteredPlaces = [...PlacesData];

    // Apply difficulty filter
    if (difficultyFilter !== "all") {
      filteredPlaces = filteredPlaces.filter(
        (place) => place.difficulty === difficultyFilter.toLowerCase()
      );
    }

    // Apply search filter
    if (searchQuery) {
      filteredPlaces = filteredPlaces.filter(
        (place) =>
          place.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Exclude specific link if provided
    if (excludeLink) {
      filteredPlaces = filteredPlaces.filter(
        (place) => place.link !== excludeLink
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filteredPlaces.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filteredPlaces.sort((a, b) => b.price - a.price);
        break;
      case "duration-short":
        filteredPlaces.sort((a, b) =>
          a.duration.localeCompare(b.duration, undefined, { numeric: true })
        );
        break;
      case "duration-long":
        filteredPlaces.sort((a, b) =>
          b.duration.localeCompare(a.duration, undefined, { numeric: true })
        );
        break;
      default:
        // Keep original order for "recommended"
        break;
    }

    // Apply randomization if needed
    if (randomize) {
      filteredPlaces.sort(() => Math.random() - 0.5);
    }

    // Apply limit if provided
    if (limit) {
      filteredPlaces = filteredPlaces.slice(0, limit);
    }

    return filteredPlaces;
  }, [difficultyFilter, sortBy, searchQuery, limit, excludeLink, randomize]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20 sm:pt-28 pb-12">
      <section className="container mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <div className="mb-8 sm:mb-12 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4"
          >
            Discover Your Next Adventure
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Explore our carefully curated collection of Himalayan treks
          </motion.p>
        </div>

        {/* Filters Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mb-8 sm:mb-12"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <div className="space-y-4 lg:space-y-0 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
              {/* Search Bar */}
              <div className="relative w-full lg:w-96">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search treks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300 text-sm sm:text-base"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="lg:hidden flex items-center justify-between w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <span className="text-gray-700 dark:text-gray-200">
                    Filters
                  </span>
                  <FaFilter
                    className={`transform transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Filter Controls */}
                <div
                  className={`flex flex-col sm:flex-row gap-3 w-full lg:w-auto ${isFilterOpen || "lg:flex hidden"}`}
                >
                  <div className="relative group flex-1 sm:flex-none">
                    <select
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value)}
                      className="appearance-none w-full sm:w-44 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer transition-all duration-300 pr-10 text-sm sm:text-base"
                    >
                      <option value="all">All Difficulties</option>
                      <option value="easy">Easy</option>
                      <option value="moderate">Moderate</option>
                      <option value="challenging">Challenging</option>
                    </select>
                    <FaMountain className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="relative group flex-1 sm:flex-none">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none w-full sm:w-44 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer transition-all duration-300 pr-10 text-sm sm:text-base"
                    >
                      <option value="recommended">Recommended</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="duration-short">Duration: Shortest</option>
                      <option value="duration-long">Duration: Longest</option>
                    </select>
                    <FaSort className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(difficultyFilter !== "all" ||
              sortBy !== "recommended" ||
              searchQuery) && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Active filters:
                  </span>
                  {difficultyFilter !== "all" && (
                    <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 rounded-full">
                      {difficultyFilter.charAt(0).toUpperCase() +
                        difficultyFilter.slice(1)}
                    </span>
                  )}
                  {sortBy !== "recommended" && (
                    <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                      {sortBy
                        .split("-")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </span>
                  )}
                  {searchQuery && (
                    <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">
                      Search: {searchQuery}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setDifficultyFilter("all");
                      setSortBy("recommended");
                      setSearchQuery("");
                    }}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-0 sm:px-0"
        >
          {displayedPlaces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {displayedPlaces.map((item, index) => (
                <motion.div
                  key={item._id}
                  variants={itemVariants}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="h-full"
                >
                  <PlaceCard {...item} placeData={item} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 sm:py-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg px-4"
            >
              <FaMapMarkedAlt className="mx-auto text-4xl sm:text-5xl text-gray-400 dark:text-gray-600 mb-4" />
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-4">
                No treks found matching your criteria
              </p>
              <button
                onClick={() => {
                  setDifficultyFilter("all");
                  setSortBy("recommended");
                  setSearchQuery("");
                }}
                className="px-4 sm:px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default Places;
