import React, { useState, useEffect } from "react";
import api from "../services/api";
import logo from "../assets/logoTradex.svg";
import { Link } from "react-router-dom";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [user, setUser] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const getFrontendUrl = () => {
    if (import.meta.env.VITE_FRONTEND_URL) return import.meta.env.VITE_FRONTEND_URL;
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    if (isLocal) {
      return window.location.port === "5174"
        ? "http://localhost:5173"
        : `${window.location.origin}/`;
    }
    return `${window.location.origin}/`;
  };

  const fetchUser = async () => {
    // 1. Check if user is passed in URL query param from frontend login/signup
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get("user");
    if (userParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem("zentrade_user", JSON.stringify(parsed));
        setUser(parsed);
        // Clean URL without reload
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      } catch (e) {
        console.error("Error parsing user from URL:", e);
      }
    }

    // 2. Check localStorage
    const savedUser = localStorage.getItem("zentrade_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }

    // 3. Check /currentUser from backend session
    try {
      const response = await api.get("/currentUser");
      if (response.data && response.data.user) {
        setUser(response.data.user);
        localStorage.setItem("zentrade_user", JSON.stringify(response.data.user));
      }
    } catch (err) {
      console.log("User session check:", err.message);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("zentrade_user");
      await api.post("/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      const frontendUrl = getFrontendUrl();
      window.location.href = `${frontendUrl.replace(/\/$/, "")}/login`;
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  const getInitials = (name) => {
    if (!name) return "ZT";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="menu-container">
      <Link to="/" onClick={() => handleMenuClick(0)} className="d-flex align-items-center" title="ZenTrade Dashboard">
        <img src={logo} style={{ width: "38px", height: "38px", cursor: "pointer", transition: "transform 0.2s" }} alt="ZenTrade Logo" />
      </Link>
      <div className="menus">
        <ul>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/"
              onClick={() => handleMenuClick(0)}
            >
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/orders"
              onClick={() => handleMenuClick(1)}
            >
              <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>
                Orders
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/holdings"
              onClick={() => handleMenuClick(2)}
            >
              <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/positions"
              onClick={() => handleMenuClick(3)}
            >
              <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>
                Positions
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/funds"
              onClick={() => handleMenuClick(4)}
            >
              <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>
                Funds
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/apps"
              onClick={() => handleMenuClick(6)}
            >
              <p className={selectedMenu === 6 ? activeMenuClass : menuClass}>
                Apps
              </p>
            </Link>
          </li>
          <li>
            <a
              href={getFrontendUrl()}
              style={{ textDecoration: "none" }}
              title="Go to main website"
            >
              <p className={menuClass} style={{ color: "#2563EB", fontWeight: "600" }}>
                <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: "0.8rem", marginRight: "4px" }}></i>
                Website
              </p>
            </a>
          </li>
        </ul>
        <hr />
        <div className="profile-wrapper" style={{ position: "relative" }}>
          <div className="profile" onClick={toggleProfileDropdown} style={{ cursor: "pointer" }}>
            <div className="avatar">{getInitials(user?.name)}</div>
            <p className="username">{user?.name || "My Account"}</p>
          </div>

          {isProfileDropdownOpen && (
            <div
              className="profile-dropdown shadow"
              style={{
                position: "absolute",
                top: "100%",
                right: "0",
                marginTop: "10px",
                backgroundColor: "#fff",
                borderRadius: "8px",
                padding: "12px 16px",
                minWidth: "210px",
                zIndex: 1000,
                border: "1px solid #e0e0e0",
              }}
            >
              <p style={{ margin: 0, fontWeight: "600", color: "#333" }}>
                {user?.name || "Guest Trader"}
              </p>
              <p style={{ margin: "2px 0 10px 0", fontSize: "0.85rem", color: "#666" }}>
                {user?.email || "Not signed in"}
              </p>
              <hr style={{ margin: "8px 0" }} />
              <a
                href={getFrontendUrl()}
                style={{
                  display: "block",
                  padding: "6px 0",
                  color: "#2563EB",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                }}
              >
                <i className="fa-solid fa-globe" style={{ marginRight: "6px" }}></i>
                Back to Website
              </a>
              <hr style={{ margin: "8px 0" }} />
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: "6px 12px",
                  backgroundColor: "#ff4d4f",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
