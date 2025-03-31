import { createContext, useState, useEffect } from "react";

// auth context object used to access and manage authentication state
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // token state to store JWT token
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // save token to local storage after login
  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  // remove token from local storage after logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };
  // check if token is present
  const isAuthenticated = !!token;

  // shre token, login, logout and isAuthenticated state with all components wrapped in AuthProvider
  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        isAuthenticated,
      }}
    >
        {/* placeholder */}
      {children}
    </AuthContext.Provider>
  );

};
