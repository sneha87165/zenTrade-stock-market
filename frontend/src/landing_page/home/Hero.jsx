import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Hero() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("zentrade_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const getDashboardUrl = () => {
    if (import.meta.env.VITE_DASHBOARD_URL) return import.meta.env.VITE_DASHBOARD_URL;
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
    <div className="container py-5">
      <div className="row text-center justify-content-center">
        <div className="col-12">
          <img 
            src="media/images/homeHero.png" 
            className="img-fluid mb-4" 
            alt="Hero"
          />
        </div>
        <div className="col-lg-8 col-md-10 col-12">
          <h1 className="mt-3 text-muted">Invest in everything</h1>
          <p className="text-muted">
            Online platform to invest in stocks, derivatives, mutual funds, ETFs, bonds, and more.
          </p>
          {user ? (
            <a href={getDashboardUrl()} className="btn btn-primary fs-5 mt-3 px-4 py-2">
              <i className="fa-solid fa-arrow-right-to-bracket me-2"></i> Open Trading Dashboard
            </a>
          ) : (
            <Link to="/signup" className="btn btn-primary fs-5 mt-3 px-4 py-2">
              Sign up for free
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Hero;
