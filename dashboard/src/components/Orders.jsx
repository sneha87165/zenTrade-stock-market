import React, { useState, useEffect, useContext } from "react";
import api from "../services/api";
import GeneralContext from "./GeneralContext";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { refreshKey } = useContext(GeneralContext);

  useEffect(() => {
    fetchOrders();
  }, [refreshKey]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/orders");
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="orders">
      <h3 className="title">Orders ({orders.length})</h3>

      {loading ? (
        <p style={{ padding: "20px", color: "#666" }}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="no-orders" style={{ padding: "40px 20px", textAlign: "center" }}>
          <p style={{ color: "#888", fontSize: "1.1rem" }}>
            You haven't placed any orders today.
          </p>
        </div>
      ) : (
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Instrument</th>
                <th>Qty.</th>
                <th>Price</th>
                <th>Type</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const isBuy = (order.action || "").toUpperCase() === "BUY";
                return (
                  <tr key={order._id || index}>
                    <td>{order.name}</td>
                    <td>{order.qty}</td>
                    <td>₹{(order.price || 0).toFixed(2)}</td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          backgroundColor: isBuy ? "#e6f4ea" : "#fce8e6",
                          color: isBuy ? "#137333" : "#c5221f",
                        }}
                      >
                        {order.action}
                      </span>
                    </td>
                    <td>{order.date ? new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "N/A"}</td>
                    <td>
                      <span style={{ color: "#4caf50", fontWeight: "500" }}>
                        COMPLETE
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
