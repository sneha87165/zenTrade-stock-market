import React, { useEffect } from "react";
import axios from "./axiosInstance";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        localStorage.removeItem("zentrade_user");
        await axios.post("/logout");
        console.log("User logged out successfully");
      } catch (error) {
        console.error("Logout error:", error.response?.data?.message || error.message);
      } finally {
        localStorage.removeItem("zentrade_user");
        navigate("/login");
      }
    };

    handleLogout();
  }, [navigate]);

  return (
    <div className="container text-center my-5 py-5">
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <h4>Logging Out...</h4>
      <p className="text-muted">Redirecting to login page</p>
    </div>
  );
};

export default Logout;
