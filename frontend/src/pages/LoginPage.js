import { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import "./styles/LoginPage.css";

/**
 * Renders the login form with input validation, API integration, animated transitions,
 * and context-based authentication handling.
 * @returns LoginPage component
 */
export default function LoginPage() {
  // State to track form input values
  const [form, setForm] = useState({ email: "", password: "" });
  // Access login function from AuthContext
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  // UI state for error display and form validation
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);
  const [showError, setShowError] = useState(false);
  // Ref for triggering CSS page transition animations
  const pageRef = useRef(null);

  /**
   * Handles form input changes by updating local state
   * @param {*} e
   * @returns
   */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /**
   * Handles form submission
   * Validates form, Sends login request to backend
   * On success, stores token and navigates to /tasks with animation
   * On failure, displays error message
   * @param {*} e
   * @returns
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formElement = e.target;
    if (!formElement.checkValidity()) {
      setValidated(true);
      return;
    }

    setValidated(false);
    setError(null);
    try {
      const res = await api.post("/login", form);
      const { token } = res.data;
      login(token);
      if (pageRef.current) {
        pageRef.current.classList.add("fade-out");
      }
      setTimeout(() => {
        navigate("/tasks");
      }, 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Login failed.";
      setError(errorMsg);
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        setTimeout(() => setError(null), 300);
      }, 3000);
    }
  };

  return (
    <div
      ref={pageRef}
      className="login-page d-flex align-items-center justify-content-center"
    >
      {/* Back to home button with animation */}
      <button
        id="bottone1"
        className="position-absolute top-0 start-0 m-3"
        onClick={() => {
          if (pageRef.current) {
            pageRef.current.classList.add("fade-out");
          }
          setTimeout(() => {
            navigate("/");
          }, 1000);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-calendar-event"
          viewBox="0 0 16 16"
        >
          <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
        </svg>
        <span>Back to Home</span>
      </button>

      {/* Login box */}
      <div className="text-center w-100 px-3" style={{ maxWidth: "420px" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
          fill="currentColor"
          className="bi bi-calendar2-range mb-3"
          viewBox="0 0 16 16"
        >
          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
          <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5zM9 8a1 1 0 0 1 1-1h5v2h-5a1 1 0 0 1-1-1m-8 2h4a1 1 0 1 1 0 2H1z" />
        </svg>
        <h2 className="mb-2">Let’s get things done!</h2>
        <p className="text-muted mb-4">Small steps lead to big progress.</p>

        {/* Login form card */}
        <div className="form-glass p-4 rounded">
          <h4 className="text-center mb-3">Login</h4>

          {/* Error alert */}
          {error && (
            <div
              className={`alert alert-danger fade ${showError ? "show" : ""}`}
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Login form */}
          <form
            noValidate
            className={validated ? "was-validated" : ""}
            onSubmit={handleSubmit}
          >
            {/* Email input */}
            <div className="mb-3 text-start">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                name="email"
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">A valid email is required.</div>
            </div>

            {/* Password input */}
            <div className="mb-3 text-start">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                name="password"
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">Password is required.</div>
            </div>

            {/* Submit button */}
            <button type="submit" className="btn-grad">
              Login
            </button>
          </form>
        </div>

        {/* Sign-up link */}
        <p className="mt-4 mb-0 text-center">
          Don’t have an account?{" "}
          <button
            className="link-opacity-100-hover btn btn-link p-0"
            onClick={(e) => {
              e.preventDefault();
              if (pageRef.current) {
                pageRef.current.classList.add("fade-out");
              }
              setTimeout(() => {
                navigate("/register");
              }, 1000);
            }}
          >
            Sign up
          </button>
        </p>

        <p className="mt-2 mb-0 text-center">
          Forgot your password?{" "}
          <button
            className="link-opacity-100-hover btn btn-link p-0"
            onClick={(e) => {
              e.preventDefault();
              if (pageRef.current) {
                pageRef.current.classList.add("fade-out");
              }
              setTimeout(() => {
                navigate("/reset-password");
              }, 1000);
            }}
          >
            Reset
          </button>
        </p>
      </div>
    </div>
  );
}
