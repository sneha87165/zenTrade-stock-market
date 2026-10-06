import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function OpenAccount() {
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
        <div className="container p-5 mb-5 text-center">
            <h1 className="mt-5">Open a ZenTrade account</h1>
            <p className="mb-4">
                Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and F&O trades.
            </p>
            {user ? (
                <a href={getDashboardUrl()} className="btn btn-primary fs-5 mb-5 px-4 py-2">
                    <i className="fa-solid fa-chart-pie me-2"></i> Go to Dashboard
                </a>
            ) : (
                <Link to="/signup" className="btn btn-primary fs-5 mb-5 px-4 py-2">
                    Sign up for free
                </Link>
            )}
        </div>
    );
}

export default OpenAccount;
