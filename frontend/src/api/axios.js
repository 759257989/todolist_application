// src/api.js
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001/api"
});

// Add a request interceptor to include the token in headers
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
