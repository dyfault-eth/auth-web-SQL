import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null);
  const [expiration, setExpiration] = useState(null)

  const setAuthData = (userData) => {
    setUserId(userData.id);
    setEmail(userData.email);
    setExpiration(userData.expiration)
  };

  const clearAuthData = () => {
    setUserId(null);
    setEmail(null)
    setExpiration(null)
  };

  const checkTokenExpiration = () => {
    if (new Date(expiration) < new Date()) {
      clearAuthData();
      return false
    } else {
      return true;
    }
  };

  return (
    <AuthContext.Provider value={{ userId, email, expiration, setAuthData, clearAuthData, checkTokenExpiration }}>
      {children}
    </AuthContext.Provider>
  );
};