import { createContext, useState, useEffect } from "react";

/**
 * AuthContext provides access to authentication state and actions (login, logout).
 * Components can consume this context to determine if a user is logged in,
 * retrieve the token, or trigger login/logout.
 */
export const AuthContext = createContext();

/**
 * AuthProvider wraps around components that need access to authentication state.
 * It manages the JWT token using React state and localStorage.
 * @param {*} param0
 * @returns
 */
export const AuthProvider = ({ children }) => {
  // token state to store JWT token
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  /**
   * Stores the token in both localStorage and React state. Called when the user successfully logs in
   * @param {*} newToken
   */
  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  /**
   * Removes the token from localStorage and React state. Called when the user logs out.
   */
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };
  // Boolean indicating if the user is authenticated
  const isAuthenticated = !!token;

  /**
   * Provides authentication state and actions to all children components.
   */
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
