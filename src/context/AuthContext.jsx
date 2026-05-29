import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getCurrentUser } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("crm_token"));
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token;

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          localStorage.removeItem("crm_token");
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await loginUser({ email, password });
      const { access_token, user: userDetails } = data;
      localStorage.setItem("crm_token", access_token);
      setToken(access_token);
      setUser(userDetails);
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password, phone_number) => {
    try {
      const data = await registerUser({ name, email, password, phone_number });
      // Depending on API, register might return token or just success
      // If it returns token, we log them in automatically
      if (data.access_token) {
        localStorage.setItem("crm_token", data.access_token);
        setToken(data.access_token);
        setUser(data.user);
      }
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("crm_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
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
