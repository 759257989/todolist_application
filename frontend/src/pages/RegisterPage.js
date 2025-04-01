import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/RegisterPage.css";
import api from "../api/axios";

/**
 * Handles user registration via a form. Includes input validation,
 * API call to register the user, animated transitions, and error handling.
 * @returns RegisterPage component
 */
export default function RegisterPage() {
  // State to track form input values
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  // State for error and validation UI feedback
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  // Ref for fade-out transition animation
  const pageRef = useRef(null);

  /**
   * Updates form state when input fields change
   * @param {*} e
   * @returns
   */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /**
   * Handles form submission, Validates inputs, Sends registration request, Displays error on failure
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
      await api.post("/register", form);
      if (pageRef.current) {
        pageRef.current.classList.add("fade-out");
      }
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Registration failed.";
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
      className="register-page d-flex align-items-center justify-content-center vh-100"
    >
      {/* Back button to homepage */}
      <button
        id="bottone1"
        className="d-flex align-items-center gap-2 position-absolute top-0 start-0 m-3"
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

      {/* Registration form container */}
      <div className="text-center w-100" style={{ maxWidth: "400px" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
          fill="currentColor"
          className="bi bi-graph-up-arrow"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5"
          />
        </svg>
        <h2 className="mb-2">Get started with your account</h2>
        <p className="text-muted mb-4">
          Start building habits that move you forward.
        </p>

        {/* Registration form card */}
        <div className="form-glass p-4 rounded shadow">
          <h4 className="text-center mb-3">Register</h4>

          {error && (
            <div
              className={`alert alert-danger fade ${showError ? "show" : ""}`}
              role="alert"
            >
              {error}
            </div>
          )}

          <form
            noValidate
            className={validated ? "was-validated" : ""}
            onSubmit={handleSubmit}
          >
            {/* Email field */}
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
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">
                A proper Email address is required.
              </div>
            </div>

            {/* Username field */}
            <div className="mb-3 text-start">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                name="username"
                type="text"
                className="form-control"
                id="username"
                placeholder="Choose a username"
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">Username is required.</div>
            </div>

            {/* Password field */}
            <div className="mb-3 text-start">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                name="password"
                type="password"
                className="form-control"
                id="password"
                placeholder="Create a password"
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">Password is required.</div>
            </div>
            {/* Submit button */}
            <button type="submit" className="btn-grad">
              Get Started!
            </button>
          </form>

          {/* Navigation link to login page */}
          <p className="mt-3">
            Already have an account?{" "}
            <button
              className="link-opacity-100-hover btn btn-link p-0"
              onClick={(e) => {
                e.preventDefault();
                if (pageRef.current) {
                  pageRef.current.classList.add("fade-out");
                }
                setTimeout(() => {
                  navigate("/login");
                }, 1000);
              }}
            >
              Back to Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
