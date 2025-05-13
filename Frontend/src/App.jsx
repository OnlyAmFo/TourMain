import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./pages/Layout";
import AdminLayout from "./pages/Dashboard/Admin/AdminLayout";
import Home from "./pages/Home";
import Blogs from "./components/Blogs/Blogs";
import BestPlaces from "./components/Places/BestPlaces";
import PlacesRoute from "./components/Places/PlacesRoute";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import BlogDetails from "./components/Blogs/BlogDetails";
import { AuthProvider } from "./context/AuthContext";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AOS from "aos";
import "aos/dist/aos.css";
import AdminDashboard from "./pages/Dashboard/Admin/AdminDashboard";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider } from "./context/ThemeContext";
import TravelAssistant from "./components/AI/TravelAssistant";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import TourSuggestions from "./components/Tours/TourSuggestions";
import TourDetails from "./components/Tours/TourDetails";
import TrekSuggester from "./components/Tours/TrekSuggester";
import Chatbot from "./components/AI/Chatbot";
import UserProfile from "./components/Profile/UserProfile";
import TrekDetails from "./components/Tours/TrekDetails";
import ReviewAnalyzer from "./components/AI/ReviewAnalyzer";
import ItineraryGenerator from "./components/AI/ItineraryGenerator";
import PackingAssistant from "./components/AI/PackingAssistant";
import EmotionTrips from "./components/AI/EmotionTrips";

const App = () => {
  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 900,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                </Route>

                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="blogs" element={<Blogs />} />
                  <Route path="blogs/:id" element={<BlogDetails />} />
                  <Route path="best-places" element={<BestPlaces />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route
                    path="dashboard"
                    element={
                      <ProtectedRoute>
                        <UserDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="places/*" element={<PlacesRoute />} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/tours" element={<TourSuggestions />} />
                <Route path="/tours/:id" element={<TourDetails />} />
                <Route path="/trek-suggester" element={<TrekSuggester />} />
                <Route path="/trek-details" element={<TrekDetails />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/travel-assistant" element={<TravelAssistant />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/review-analyzer" element={<ReviewAnalyzer />} />
                <Route
                  path="/itinerary-generator"
                  element={<ItineraryGenerator />}
                />
                <Route
                  path="/packing-assistant"
                  element={<PackingAssistant />}
                />
                <Route path="/emotion-trips" element={<EmotionTrips />} />
              </Routes>
            </main>
          </div>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
