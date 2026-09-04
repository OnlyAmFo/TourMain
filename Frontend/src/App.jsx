import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./pages/Layout";
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
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import TourSuggestions from "./components/Tours/TourSuggestions";
import TourDetails from "./components/Tours/TourDetails";
import TrekSuggester from "./components/Tours/TrekSuggester";
import UserProfile from "./components/Profile/UserProfile";
import TrekDetails from "./components/Tours/TrekDetails";

const AppShell = () => {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/places"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

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
          <Route path="/profile" element={<UserProfile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
};

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
            <AppShell />
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
