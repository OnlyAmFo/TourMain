import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/auth";
import { notify } from "../utils/notifications";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = authService.getCurrentUser();

        if (token && storedUser) {
          // Validate token by making a request to the server
          try {
            await authService.validateToken();
            setUser(storedUser);
          } catch (error) {
            // If token is invalid, clear everything
            authService.logout();
            notify.error("Session expired. Please login again.");
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      return response;
    } catch (error) {
      notify.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      return response;
    } catch (error) {
      notify.error(error.response?.data?.message || "Registration failed");
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
