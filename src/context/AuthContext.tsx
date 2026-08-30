import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  loginAsDemoUser: (role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('support_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('support_token');
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const handleAuthResponse = (data: { _id: string; name: string; email: string; role: UserRole; token: string }) => {
    const userData: User = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role
    };
    setUser(userData);
    setToken(data.token);
    localStorage.setItem('support_user', JSON.stringify(userData));
    localStorage.setItem('support_token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.success) {
        handleAuthResponse(res.data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/register', { name, email, password, role });
      if (res.data.success) {
        handleAuthResponse(res.data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemoUser = async (role: UserRole) => {
    let email = 'customer@demo.com';
    if (role === 'agent') email = 'agent@demo.com';
    if (role === 'admin') email = 'admin@demo.com';
    await login(email, 'password123');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('support_user');
    localStorage.removeItem('support_token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, loginAsDemoUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
