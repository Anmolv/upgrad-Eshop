import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    isAdmin: false,
    user: null,
  });

  const logIn = (user, isAdmin) => {
    setAuthState({
      isLoggedIn: true,
      isAdmin,
      user,
    });
  };

  const logOut = () => {
    setAuthState({
      isLoggedIn: false,
      isAdmin: false,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
