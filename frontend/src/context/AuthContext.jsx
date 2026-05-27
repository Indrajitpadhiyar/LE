/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Axios instance with base URL
const api = axios.create({
  baseURL: '/api/auth',
  headers: { 'Content-Type': 'application/json' },
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('le-token'));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'admin';

  // Set or clear axios default header when token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('le-token', token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('le-token');
    }
  }, [token]);

  // Validate saved token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/me');
        if (data.success) {
          setUser(data.user);
        } else {
          setToken(null);
          setUser(null);
        }
      } catch {
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    validateToken();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Signup
  const signup = useCallback(async (name, email, password) => {
    const { data } = await api.post('/register', { name, email, password });
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  }, []);

  // User login
  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/login', { email, password });
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  }, []);

  // Google login
  const googleLogin = useCallback(async (idToken) => {
    const { data } = await api.post('/google-login', { idToken });
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  }, []);

  // Admin login
  const adminLogin = useCallback(async (email, password) => {
    const { data } = await api.post('/admin/login', { email, password });
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  }, []);

  // Logout
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('le-token');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        signup,
        login,
        googleLogin,
        adminLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
