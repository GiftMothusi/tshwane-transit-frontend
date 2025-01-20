// app/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { api, auth } from '../config';

interface User {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  preferred_language?: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
}

interface SignUpData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone_number: string;
  preferred_language?: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Configure axios defaults
axios.defaults.baseURL = api.baseURL;
axios.defaults.timeout = api.timeout;
axios.defaults.headers.common = {
  ...axios.defaults.headers.common,
  ...api.headers,
};

const STORAGE_KEY = auth.storage.keys;

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      console.log('Loading stored auth data...');
      const [storedUser, storedToken] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY.user),
        AsyncStorage.getItem(STORAGE_KEY.token)
      ]);

      if (storedUser && storedToken) {
        console.log('Found stored user data');
        setUser(JSON.parse(storedUser));
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } else {
        console.log('No stored auth data found');
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setLoading(false);
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting login with email:', email);
      console.log('API URL:', `${axios.defaults.baseURL}/auth/login`);
      
      const response = await axios.post('/auth/login', {
        email,
        password,
      });

      console.log('Login response:', response.data);

      const { user, token } = response.data;

      setUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEY.user, JSON.stringify(user)),
        AsyncStorage.setItem(STORAGE_KEY.token, token)
      ]);

      console.log('Login successful, user data stored');
    } catch (error) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
      }
      throw new Error(axios.isAxiosError(error) && error.response ? 
        error.response.data.message : 'Authentication failed');
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      console.log('Attempting registration with:', {
        ...data,
        password: '[REDACTED]',
        password_confirmation: '[REDACTED]'
      });
      
      console.log('API URL:', `${axios.defaults.baseURL}/auth/register`);
      
      const response = await axios.post('/auth/register', data);
      console.log('Registration response:', response.data);
      
      const { user, token } = response.data;

      setUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEY.user, JSON.stringify(user)),
        AsyncStorage.setItem(STORAGE_KEY.token, token)
      ]);

      console.log('Registration successful, user data stored');
    } catch (error) {
      console.error('Registration error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
      }
      throw error;
    }
  };

  const signOut = async () => {
    try {
        console.log('Starting logout process...');
        
        // First clear local storage and state
        await AsyncStorage.multiRemove([
            STORAGE_KEY.user,
            STORAGE_KEY.token
        ]);
        console.log('Local storage cleared');

        // Then try to call the backend logout endpoint
        try {
            await axios.post('/auth/logout');
            console.log('Backend logout successful');
        } catch (error) {
            // Ignore backend errors during logout
            console.log('Backend logout failed, but continuing with local logout');
        }

        // Clear axios headers and user state
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        
        console.log('Logout completed successfully');
    } catch (error) {
        console.error('Logout error:', error);
        // Ensure user state is cleared even if there's an error
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        throw error;
    }
};

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      loading, 
      signIn, 
      signUp, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider };
export default AuthProvider;