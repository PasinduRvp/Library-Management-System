import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import SummaryApi from '../common';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiRequest(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
      });

      if (result.success) {
        setUser(result.data);
      } else {
        setUser(null);
        setError(result.error);
      }
    } catch (err) {
      setUser(null);
      setError('Failed to fetch user details');
      console.error('Error fetching user details:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiRequest(SummaryApi.signIn.url, {
        method: SummaryApi.signIn.method,
        body: JSON.stringify({ email, password }),
      });

      if (result.success) {
        setUser(result.data);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError('Login failed');
      return { success: false, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiRequest(SummaryApi.logout_user.url, {
        method: SummaryApi.logout_user.method,
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('authToken');
      // Clear cookie if you're using cookies
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    refreshUser: fetchUserDetails,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};