import React, { useState, useContext } from "react";
import api from "../services/api";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, mode = "BUY", onOrderPlaced }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { closeBuyWindow } = useContext(GeneralContext);

  const handleBuyOrSellClick = async () => {
    if (stockQuantity <= 0) {
      setErrorMessage("Quantity must be at least 1.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await api.post("/newOrder", {
        name: uid,
        qty: stockQuantity,
        price: stockPrice,
        mode: mode || "BUY",
      });

      if (response.status === 200) {
        if (onOrderPlaced) {
          onOrderPlaced();
        }
        closeBuyWindow();
      }
    } catch (error) {
      console.error("Error while placing order:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="header" style={{ marginBottom: "12px" }}>
          <h5 style={{ margin: 0, color: mode === "BUY" ? "#4184f3" : "#df514c" }}>
            {mode} {uid}
          </h5>
        </div>

        {errorMessage && (
          <p style={{ color: "red", fontSize: "0.85rem", marginBottom: "8px" }}>
            {errorMessage}
          </p>
        )}

        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              onChange={(e) => setStockQuantity(Math.max(1, Number(e.target.value)))}
              value={stockQuantity}
              min="1"
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(Math.max(0, Number(e.target.value)))}
              value={stockPrice}
              min="0"
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹{(stockQuantity * stockPrice).toFixed(2)}</span>
        <div>
          <button
            className={`btn ${mode === "BUY" ? "btn-blue" : "btn-red"}`}
            onClick={handleBuyOrSellClick}
            disabled={loading}
          >
            {loading ? "Placing..." : mode === "BUY" ? "Buy" : "Sell"}
          </button>
          <button className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
