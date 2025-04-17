import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await axios.post("http://localhost:5000/api/users/login", {
      email,
      password,
    });
    const { token, user: userData } = response.data;
    localStorage.setItem("token", token);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const response = await axios.post(
      "http://localhost:5000/api/users/register",
      {
        name,
        email,
        password,
      }
    );
    const { token, user: userData } = response.data;
    localStorage.setItem("token", token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
