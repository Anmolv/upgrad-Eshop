import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    isAdmin: false,
    userEmail: null,
    userId: null,
    access_token: ''
  });

  const logIn = (userEmail, isAdmin, access_token, userId) => {
    setAuthState({
      isLoggedIn: true,
      isAdmin: isAdmin,
      userEmail: userEmail,
      access_token: access_token,
      userId: userId
    });
  };

  const logOut = () => {
    setAuthState({
      isLoggedIn: false,
      isAdmin: false,
      userEmail: null,
      access_token: '',
      userId: null
    });
  };

  return (
    <AuthContext.Provider value={{ authState, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
