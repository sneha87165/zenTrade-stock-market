import React, { useState, useEffect, useContext } from "react";
import api from "../services/api";
import GeneralContext from "./GeneralContext";

const Summary = () => {
  const [summaryData, setSummaryData] = useState({});
  const [loading, setLoading] = useState(true);

  const { refreshKey } = useContext(GeneralContext);

  useEffect(() => {
    fetchSummary();
  }, [refreshKey]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const summaryResponse = await api.get("/api/summary");
      setSummaryData(summaryResponse.data || {});
    } catch (error) {
      console.error("Error fetching summary data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "20px", color: "#666" }}>Loading account summary...</div>;
  }

  const isProfit = (summaryData.profitLoss || 0) >= 0;

  const getDisplayName = () => {
    if (summaryData.username && summaryData.username !== "User") {
      return summaryData.username;
    }
    const savedUser = localStorage.getItem("zentrade_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.name) return parsed.name;
      } catch (e) {}
    }
    return "Trader";
  };

  return (
    <>
      <div className="username">
        <h6>Hi, {getDisplayName()}!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>₹{summaryData.marginAvailable || 0}k</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>₹{summaryData.marginsUsed || 0}k</span>
            </p>
            <p>
              Opening balance <span>₹{summaryData.openingBalance || 0}k</span>
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings ({summaryData.holdingsCount || 0})</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={isProfit ? "profit" : "loss"}>
              {isProfit ? "+" : ""}
              ₹{summaryData.profitLoss || 0}k{" "}
              <small>
                {isProfit ? "+" : ""}
                {summaryData.profitPercentage || 0}%
              </small>
            </h3>
            <p>P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>₹{summaryData.currentValue || 0}k</span>
            </p>
            <p>
              Investment <span>₹{summaryData.investment || 0}k</span>
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;
