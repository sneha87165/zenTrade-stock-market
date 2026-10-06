import React, { useState } from "react";
import axios from "./axiosInstance";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("/signup", formData);

      if (response.status === 200) {
        const user = response.data.user;
        if (user) {
          localStorage.setItem("zentrade_user", JSON.stringify(user));
        }

        let baseDashboardUrl = import.meta.env.VITE_DASHBOARD_URL;
        if (!baseDashboardUrl) {
          const isLocal =
            window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1";
          if (isLocal) {
            baseDashboardUrl =
              window.location.port === "5173"
                ? "http://localhost:5174"
                : `${window.location.origin}/dashboard`;
          } else {
            baseDashboardUrl = `${window.location.origin}/dashboard`;
          }
        }

        const userParam = user ? `?user=${encodeURIComponent(JSON.stringify(user))}` : "";
        window.location.href = `${baseDashboardUrl}${userParam}`;
      }
    } catch (err) {
      console.error("Signup error:", err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Signup failed. Please try again.");
      } else {
        setError("Failed to connect to the server. Please check your network or server status.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="d-flex align-items-center justify-content-center vh-100">
      <div className="container">
        <div className="row d-flex align-items-center justify-content-center">
          {/* Left Image Column */}
          <div className="col-lg-6 col-md-8 d-none d-md-block text-center">
            <img
              src="https://signup.zerodha.com/assets/landing-DQ76ex-B.svg"
              className="img-fluid"
              alt="Signup Banner"
              style={{ maxWidth: "80%" }}
            />
          </div>

          {/* Signup Form Column */}
          <div className="col-lg-5 col-md-8">
            <div className="card shadow p-4 border-0" style={{ borderRadius: "12px" }}>
              <h3 className="text-center mb-3 fw-bold" style={{ color: "#1D4ED8" }}>
                Create ZenTrade Account
              </h3>
              <p className="text-muted text-center mb-4">Start your investment journey today</p>

              {error && (
                <div className="alert alert-danger py-2" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label className="form-label fw-semibold">Email address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="name@example.com"
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Create a strong password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 mt-2"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Sign up"}
                </button>

                <p className="text-center mt-3 mb-0 text-muted">
                  Already have an account?{" "}
                  <Link to="/login" style={{ color: "#007BFF", fontWeight: "600" }}>
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
