import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ResetPasswordPage.css";
import api from "../api/axios";

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const pageRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formElement = e.target;

    // Trigger native validation first
    if (!formElement.checkValidity()) {
      setValidated(true);
      return;
    }

    // Custom password match check
    if (form.password !== form.confirm) {
      setValidated(true);
      setError("Passwords do not match.");
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        setTimeout(() => setError(null), 300);
      }, 3000);
      return;
    }

    // Everything valid
    setValidated(false);
    setError(null);

    try {
      await api.post("/forgot-password", {
        email: form.email,
        newPassword: form.password,
      });

      if (pageRef.current) {
        pageRef.current.classList.add("fade-out");
      }

      setTimeout(() => {
        setSubmitted(true);
        navigate("/login");
      }, 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Password reset failed.";
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
      className="reset-page d-flex align-items-center justify-content-center vh-100"
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

      {/* Reset password form */}
      <div className="text-center w-100" style={{ maxWidth: "400px" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          fill="currentColor"
          class="bi bi-person-lock"
          viewBox="0 0 16 16"
        >
          <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0 5.996V14H3s-1 0-1-1 1-4 6-4q.845.002 1.544.107a4.5 4.5 0 0 0-.803.918A11 11 0 0 0 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664zM9 13a1 1 0 0 1 1-1v-1a2 2 0 1 1 4 0v1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm3-3a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1" />
        </svg>

        <h2 className="mb-2">Let’s Get You a New Password</h2>
        <p className="text-muted mb-4">
          To reset your password, enter your email and your new password.
        </p>

        <div className="form-glass p-4 rounded shadow">
          <h4 className="text-center mb-3">Reset</h4>

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
            className={`needs-validation ${validated ? "was-validated" : ""}`}
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

            {/* New Password input */}
            <div className="mb-3 text-start">
              <label htmlFor="password" className="form-label">
                New Password
              </label>
              <input
                name="password"
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter new password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">New password is required.</div>
            </div>

            {/* Confirm Password input */}
            <div className="mb-3 text-start">
              <label htmlFor="confirm" className="form-label">
                Confirm Password
              </label>
              <input
                name="confirm"
                type="password"
                className={`form-control ${
                  validated && form.confirm && form.password !== form.confirm
                    ? "is-invalid"
                    : ""
                }`}
                id="confirm"
                placeholder="Confirm new password"
                value={form.confirm}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">
                {form.confirm && form.password !== form.confirm
                  ? "Passwords must match."
                  : "Please confirm your password."}
              </div>
            </div>

            <button type="submit" className="btn-grad">
              Reset Password
            </button>
          </form>

          <p className="mt-3">
            Remember your password?{" "}
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
