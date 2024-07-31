import React, { createContext, useContext, useEffect, useState } from 'react';
import { decodeToken } from "react-jwt";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [token, setToken] = useState('');

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('session') || null);
    if (isValidSession(session)) {
      authenticate(session);
    } else {
      logout();
    }
  }, []);

  const authenticate = (session) => {
    if (isValidSession(session)) {
      setIsAuthenticated(true);
      setUser(session.user);
      setToken(session.token);
      localStorage.setItem('session', JSON.stringify(session));
    } else {
      logout();
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser({});
    setToken('');
    localStorage.removeItem('session');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authenticate, logout, user, token }}>
      {children}
    </AuthContext.Provider>
  );
};


export const isValidSession = (session) => {
  try {
    if (!session) return false;

    const decodedToken = decodeToken(session.token);
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