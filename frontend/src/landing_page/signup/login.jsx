import React, { useState } from "react";
import axios from "./axiosInstance";
import { Link } from "react-router-dom";
import logo from "../../assets/logoTradex.svg";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("/login", formData);

      if (response.status === 200) {
        console.log("Login successful!", response.data);
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
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Invalid credentials or server unavailable."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-lg-10">
            <div className="card shadow border-0" style={{ borderRadius: "1rem", overflow: "hidden" }}>
              <div className="row g-0">
                {/* Left Side Image */}
                <div className="col-md-6 d-none d-md-block">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                    alt="login form"
                    className="img-fluid"
                    style={{ objectFit: "cover", height: "100%", minHeight: "450px" }}
                  />
                </div>

                {/* Right Side Form */}
                <div className="col-md-6 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <form onSubmit={handleSubmit}>
                      {/* Logo & Heading */}
                      <div className="d-flex align-items-center mb-3 pb-1">
                        <img
                          src={logo}
                          style={{ width: "42px", height: "42px", marginRight: "12px" }}
                          alt="ZenTrade Logo"
                        />
                        <span className="h2 fw-bold mb-0" style={{ color: "#1D4ED8" }}>
                          ZENTRADE
                        </span>
                      </div>
                      <h5 className="fw-normal mb-3 pb-2 text-muted">
                        Sign into your trading account
                      </h5>

                      {error && (
                        <div className="alert alert-danger py-2" role="alert">
                          {error}
                        </div>
                      )}

                      {/* Email Input */}
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

                      {/* Password Input */}
                      <div className="form-group mb-3">
                        <label className="form-label fw-semibold">Password</label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Enter your password"
                          required
                        />
                      </div>

                      {/* Login Button */}
                      <div className="pt-1 mb-3">
                        <button
                          className="btn btn-primary w-100 py-2"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? "Logging in..." : "Login"}
                        </button>
                      </div>

                      {/* Links */}
                      <p className="mb-0 text-muted">
                        Don't have an account?{" "}
                        <Link to="/signup" style={{ color: "#007BFF", fontWeight: "600" }}>
                          Register here
                        </Link>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
