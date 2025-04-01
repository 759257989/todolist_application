import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/HomePage.css"; // Importing CSS styles for the HomePage component

/**
 * A welcoming landing page that introduces the app and allows users to navigate
 * to the login or register pages with a fade-out animation effect.
 * @returns HomePage component
 */
export default function HomePage() {
  // Ref to the main page container, used for triggering CSS animations
  const pageRef = useRef(null);
  // React Router hook to navigate between pages
  const navigate = useNavigate();

  /**
   * Triggers a fade-out animation before navigating to a different route
   * @param {*} path The target route (e.g. '/login', '/register')
   */
  const handleNavigateWithAnimation = (path) => {
    if (pageRef.current) {
      pageRef.current.classList.add("fade-out-fwd");
    }
    // Navigate after animation duration
    setTimeout(() => {
      navigate(path);
    }, 700);
  };

  return (
    <div ref={pageRef} className="home-page d-flex flex-column min-vh-100">
      <div className="home-content container py-5 flex-grow-1">
        <div className="row align-items-center py-5">
          <div className="col-lg-6 col-12 mb-4 mb-lg-0 text-center text-lg-start">
            <h1 className="fw-bold mb-3">Your personal task manager.</h1>
            <p className="text-muted mb-4">
              Stay on top of your day. Organize your goals, tasks, and projects
              effortlessly.
            </p>
            {/* Navigation Buttons */}
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
              <button
                className="animated-btn"
                onClick={() => handleNavigateWithAnimation("/login")}
              >
                <span>Log In</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 74 74"
                  height="34"
                  width="34"
                >
                  <circle
                    strokeWidth="3"
                    stroke="currentColor"
                    r="35.5"
                    cy="37"
                    cx="37"
                  />
                  <path
                    fill="currentColor"
                    d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607 38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076 37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 38.5V35.5L25 35.5V38.5Z"
                  />
                </svg>
              </button>

              <button
                className="animated-btn dark-btn"
                onClick={() => handleNavigateWithAnimation("/register")}
              >
                <span>Sign Up</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="bi bi-person-add"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                  <path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z" />
                </svg>
              </button>
            </div>
          </div>
          {/* Right Section: Image */}
          <div className="col-lg-6 col-12 text-center">
            <img
              src="/homepic.jpeg"
              alt="Hero Illustration"
              className="img-fluid faded-image"
              style={{ maxHeight: "350px" }}
            />
          </div>
        </div>

        {/* Feature Highlights Section */}
        <div className="features-section row text-center shadow-sm rounded mx-1 mt-4 p-3 bg-white bg-opacity-75">
          <div className="col-md-4 mb-4">
            <i className="bi bi-calendar-date display-6"></i>
            <h5 className="fw-semibold mt-3">Simple & Clean</h5>
            <p className="text-muted">Manage and prioritize tasks easily.</p>
          </div>
          <div className="col-md-4 mb-4">
            <i className="bi bi-sunrise-fill display-6"></i>
            <h5 className="fw-semibold mt-3">Boost Productivity</h5>
            <p className="text-muted">Track habits and hit your goals.</p>
          </div>
          <div className="col-md-4 mb-4">
            <i className="bi bi-bar-chart-line-fill display-6"></i>
            <h5 className="fw-semibold mt-3">Stay Accountable</h5>
            <p className="text-muted">Never miss a deadline again.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-light text-center py-3 mt-auto">
        © 2025 TaskMaster. All rights reserved.
      </footer>
    </div>
  );
}
