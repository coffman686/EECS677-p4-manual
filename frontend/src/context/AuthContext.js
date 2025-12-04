// context for authentication state and functions

import React, { createContext, useState, useContext, useEffect } from 'react';
const AuthContext = createContext(null); // create the AuthContext with default value null

export function AuthProvider({ children }) { // AuthProvider component to wrap the app

  const [user, setUser] = useState(null); // user: The logged-in user's info, or null if not logged in
  const [token, setToken] = useState(localStorage.getItem('token')); // token: JWT token string, initialized from localStorage
  const [loading, setLoading] = useState(true); // loading: true while verifying token on app load
  const login = async (username, password) => { // login function to authenticate user

    // make a POST request to the /api/auth/login endpoint
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json(); // parse the JSON response

    // if response not ok, throw an error with message from backend
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // on success, store the token and user info in state and localStorage
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  // logout function to clear auth state
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // register function to create a new user account
  const register = async (username, password) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    // if response not ok, throw an error with message from backend
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  };

  // useEffect to verify token on initial load and whenever token changes
  useEffect(() => {
    if (token) {
      // verify token by fetching user info from /api/auth/me
      fetch('/api/auth/me', {
        headers: { 'Authorization': 'Bearer ' + token }
      })
        // if response is ok, parse JSON to get user data
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Invalid token');
        })
        // on successful verification, set user data
        .then(data => {
          setUser(data.user);
          setLoading(false);
        })
        // on failure (invalid token), clear auth state
        .catch(() => {

          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]); // re-run effect whenever token changes

  // provide the auth state and functions to children components
  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// custom hook to use the AuthContext
export function useAuth() {

  // get the context value
  const context = useContext(AuthContext);
  
  // if context is null, it means useAuth is used outside of AuthProvider
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context; // return the context value
}
