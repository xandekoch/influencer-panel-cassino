import React, { createContext, useContext, useEffect, useState } from 'react';
import { decodeToken } from "react-jwt";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [token, setToken] = useState('');

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token') || null)
    console.log("fodase", token);
    if (isValidSession(token)) {
      authenticate(token);
    } else {
      logout();
    }
  }, []);

  const authenticate = (token) => {
    if (isValidSession(token)) {
      setIsAuthenticated(true);
      setToken(token);
      const decodedToken = decodeToken(token);
      setUser({userId: decodedToken.userId, email: decodedToken.iss, isAdmin: decodedToken.isAdmin});
      localStorage.setItem('session', JSON.stringify(decodedToken));
      localStorage.setItem('token', JSON.stringify(token));
    } else {
      logout();
    }
  };


  const logout = () => {
    setIsAuthenticated(false);
    setUser({});
    setToken('');
    localStorage.removeItem('session');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authenticate, logout, user, token }}>
      {children}
    </AuthContext.Provider>
  );
};


export const isValidSession = (token) => {
  try {
    if (!token) return false;

    const decodedToken = decodeToken(token);
    console.log(decodedToken);
    const exp = decodedToken.exp;

    if (decodedToken) {
      if (exp < (new Date().getTime() + 1) / 1000) return false;
      return true;
    }

    return false;
  } catch (error) {
    console.error('Erro ao validar sessão:', error);
    return false;
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};