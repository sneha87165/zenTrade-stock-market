import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logoTradex.svg";

function Navbar() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem("zentrade_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  const getDashboardUrl = () => {
    if (import.meta.env.VITE_DASHBOARD_URL) {
      return import.meta.env.VITE_DASHBOARD_URL;
    }
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (isLocal) {
      return window.location.port === "5173"
        ? "http://localhost:5174"
        : `${window.location.origin}/dashboard`;
    }
    return `${window.location.origin}/dashboard`;
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top border-bottom bg-white py-2 shadow-sm">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Brand logo and text */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logo}
            alt="ZenTrade Logo"
            style={{ width: "36px", height: "36px", marginRight: "10px" }}
          />
          <h2 className="mb-0" style={{ color: "#1D4ED8", fontWeight: "700", fontSize: "1.45rem", letterSpacing: "0.5px" }}>
            ZENTRADE
          </h2>
        </Link>

        {/* Toggler button (hamburger) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
          <ul className="navbar-nav align-items-lg-center mb-2 mb-lg-0 gap-lg-2">
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/product">Products</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/pricing">Pricing</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/support">Support</Link>
            </li>

            {user ? (
              <>
                <li className="nav-item ms-lg-2">
                  <a
                    href={getDashboardUrl()}
                    className="btn btn-primary btn-sm px-3 py-2 fw-semibold"
                    style={{ borderRadius: "6px" }}
                  >
                    <i className="fa-solid fa-chart-line me-1"></i> Dashboard ({user.name?.split(" ")[0] || "Trader"})
                  </a>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-danger fw-semibold" to="/logout">
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item ms-lg-2">
                  <Link className="btn btn-outline-primary btn-sm px-3 py-2 fw-semibold" to="/login" style={{ borderRadius: "6px" }}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary btn-sm px-3 py-2 fw-semibold" to="/signup" style={{ borderRadius: "6px" }}>
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
