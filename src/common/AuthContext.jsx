import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    isAdmin: false,
    user: null,
    access_token: ''
  });

  const logIn = (user, isAdmin, access_token) => {
    setAuthState({
      isLoggedIn: true,
      isAdmin,
      user,
      access_token: access_token
    });
  };

  const logOut = () => {
    setAuthState({
      isLoggedIn: false,
      isAdmin: false,
      user: null,
      access_token: ''
    });
  };

  return (
    <AuthContext.Provider value={{ authState, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
