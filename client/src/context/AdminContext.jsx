import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

export const AdminProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('portfolio_admin_token') || null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          setIsAdmin(true);
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (err) {
        console.error('Verify token failed:', err);
        // On network error, keep token but don't activate admin mode unless verified
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('portfolio_admin_token', data.token);
      setToken(data.token);
      setIsAdmin(true);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err.message);
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('portfolio_admin_token');
    setToken(null);
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{ token, isAdmin, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
