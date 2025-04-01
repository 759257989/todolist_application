// src/api.js
import axios from "axios";

/**
 * Create an Axios instance with a base URL.
 * The base URL is taken from an environment variable or defaults to localhost.
 */
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001/api"
});

/**
 * Request Interceptor
 * Automatically includes a JWT token from localStorage in the Authorization header
 * of every outgoing request (if a token exists).
 */
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response Interceptor
 * Handles authentication errors (401 status codes).
 * - If a 401 response is received from a protected route (not login/register),
 *   it clears the stored token, alerts the user, and redirects to home page.
 */
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthError = error.response?.status === 401;
    const reqUrl = error.config?.url || "";

    //  show session expired message for protected routes
    const isProtectedRoute =
      !reqUrl.includes("/login") && !reqUrl.includes("/register");

    if (isAuthError && isProtectedRoute) {
      localStorage.removeItem("token");
      alert("Session expired. Please log in again.");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default instance;
