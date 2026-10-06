import React, { useState, useEffect, useContext } from "react";
import api from "../services/api";
import { VerticalGraph } from "./VerticalGraph";
import GeneralContext from "./GeneralContext";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [loading, setLoading] = useState(true);

  const { openBuyWindow, refreshKey } = useContext(GeneralContext);

  useEffect(() => {
    fetchHoldings();
  }, [refreshKey]);

  const fetchHoldings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/allHoldings");
      setAllHoldings(res.data || []);
    } catch (error) {
      console.error("Error fetching holdings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSellClick = (stockName) => {
    if (openBuyWindow) {
      openBuyWindow(stockName, "SELL");
    }
  };

  const handleDelete = async (stockId) => {
    try {
      const response = await api.delete(`/deleteHolding/${stockId}`);
      if (response.status === 200) {
        setAllHoldings((prev) => prev.filter((stock) => stock._id !== stockId));
      }
    } catch (error) {
      console.error("Error deleting stock:", error);
    }
  };

  const totalInvestment = allHoldings.reduce(
    (acc, stock) => acc + (stock.avg || 0) * (stock.qty || 0),
    0
  );
  const currentValue = allHoldings.reduce(
    (acc, stock) => acc + (stock.price || stock.avg || 0) * (stock.qty || 0),
    0
  );
  const totalProfitLoss = currentValue - totalInvestment;

  const labels = allHoldings.map((stock) => stock.name || "Unknown");
  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price || stock.avg || 0),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      {loading ? (
        <p style={{ padding: "20px", color: "#666" }}>Loading holdings...</p>
      ) : allHoldings.length === 0 ? (
        <div style={{ padding: "30px", textAlign: "center", color: "#888" }}>
          <p>No holdings found. Buy stocks from the watchlist to build your portfolio!</p>
        </div>
      ) : (
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Instrument</th>
                <th>Qty.</th>
                <th>Avg. cost</th>
                <th>LTP</th>
                <th>Cur. val</th>
                <th>P&L</th>
                <th>Net chg.</th>
                <th>Day chg.</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allHoldings.map((stock, index) => {
                const stockPrice = stock.price || stock.avg || 0;
                const curValue = stockPrice * (stock.qty || 0);
                const investedValue = (stock.avg || 0) * (stock.qty || 0);
                const pnl = curValue - investedValue;
                const isProfit = pnl >= 0.0;
                const profClass = isProfit ? "profit" : "loss";
                const dayClass = stock.isLoss ? "loss" : "profit";

                return (
                  <tr
                    key={stock._id || index}
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td>{stock.name || "Unknown"}</td>
                    <td>{stock.qty || 0}</td>
                    <td>₹{(stock.avg || 0).toFixed(2)}</td>
                    <td>₹{stockPrice.toFixed(2)}</td>
                    <td>₹{curValue.toFixed(2)}</td>
                    <td className={profClass}>
                      {isProfit ? "+" : ""}
                      ₹{pnl.toFixed(2)}
                    </td>
                    <td className={profClass}>{stock.net || "0.00%"}</td>
                    <td className={dayClass}>{stock.day || "0.00%"}</td>
                    <td>
                      {hoveredRow === index && (
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            className="sell-button"
                            style={{
                              backgroundColor: "#df514c",
                              color: "white",
                              border: "none",
                              padding: "4px 8px",
                              borderRadius: "3px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleSellClick(stock.name)}
                          >
                            Sell
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="row" style={{ marginTop: "20px" }}>
        <div className="col">
          <h5>₹{totalInvestment.toFixed(2)}</h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>₹{currentValue.toFixed(2)}</h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5 style={{ color: totalProfitLoss >= 0 ? "#4caf50" : "#df514c" }}>
            {totalProfitLoss >= 0 ? "+" : ""}₹{totalProfitLoss.toFixed(2)} (
            {totalInvestment > 0
              ? ((totalProfitLoss / totalInvestment) * 100).toFixed(2)
              : "0.00"}
            %)
          </h5>
          <p>P&L</p>
        </div>
      </div>

      {allHoldings.length > 0 && <VerticalGraph data={data} />}
    </>
  );
};

export default Holdings;
