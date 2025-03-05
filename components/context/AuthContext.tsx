import React, { createContext, useState, useContext, useEffect } from 'react';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const loadUser = async () => {
      try {
        const userJson = await SecureStore.getItemAsync('user');
        const token = await SecureStore.getItemAsync('token');
        
        if (userJson && token) {
          setUser(JSON.parse(userJson));
          router.replace('/(tabs)');
        }
      } catch (e) {
        console.error('Failed to load user from storage', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, you would call your API here
      // For now, we'll simulate a successful login
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const userData: User = {
        id: '1',
        name: 'John Appleseed',
        email: email,
      };
      
      // Store user data and token
      await SecureStore.setItemAsync('user', JSON.stringify(userData));
      await SecureStore.setItemAsync('token', 'mock-jwt-token');
      
      setUser(userData);
      router.replace('/(tabs)');
    } catch (e) {
      setError('Invalid email or password');
      console.error('Login failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, you would call your API here
      // For now, we'll simulate a successful registration
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to login screen after successful registration
      router.replace('/login');
    } catch (e) {
      setError('Registration failed. Please try again.');
      console.error('Registration failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    
    try {
      // Clear stored user data and token
      await SecureStore.deleteItemAsync('user');
      await SecureStore.deleteItemAsync('token');
      
      setUser(null);
      router.replace('/login');
    } catch (e) {
      console.error('Logout failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};