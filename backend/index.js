require("dotenv").config();

const dns = require("dns");
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
  console.warn("Could not override DNS servers:", e.message);
}

const path = require("path");
const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const flash = require("connect-flash");

const User = require("./schemas/user");
const { HoldingModel } = require("./model/HoldingModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const app = express();

const PORT = process.env.PORT || 3001;
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/traDexa";
const SESSION_SECRET = process.env.SESSION_SECRET || "ZenTradeSecretSessionKey2026";
const isProduction = process.env.NODE_ENV === "production";

// Default allowed origins
const defaultOrigins = [
  "https://tradexafrontend.vercel.app",
  "https://tradexadashboard.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

if (process.env.FRONTEND_URL) defaultOrigins.push(process.env.FRONTEND_URL);
if (process.env.DASHBOARD_URL) defaultOrigins.push(process.env.DASHBOARD_URL);

app.set("trust proxy", 1);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || defaultOrigins.includes(origin) || !isProduction) {
        callback(null, true);
      } else {
        callback(null, true); // Allow configured clients in CORS
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());

const mongoStore = MongoStore.create({
  mongoUrl: MONGO_URL,
  touchAfter: 24 * 3600,
});

mongoStore.on("error", (err) => {
  console.error("MongoDB Session Store Connection Error:", err.message);
});

// Session Configuration
const sessionOptions = {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: mongoStore,
  cookie: {
    secure: isProduction,
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
};

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration using passport-local-mongoose
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Database Connection
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => console.error("MongoDB Connection Failed:", err));

// Auth Middleware (optional protection)
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized. Please log in." });
};

// ==================== AUTHENTICATION ROUTES ====================

// SIGNUP ROUTE
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const newUser = new User({ name, email });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        console.error("Auto-login error after signup:", err);
        return res.status(500).json({ message: "Signup successful, but auto-login failed." });
      }

      const redirectUrl = process.env.DASHBOARD_URL || "https://tradexadashboard.vercel.app";
      return res.status(200).json({
        message: "Signup successful",
        redirectUrl,
        user: { id: registeredUser._id, name: registeredUser.name, email: registeredUser.email },
      });
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: err.message || "Signup failed." });
  }
});

// LOGIN ROUTE
app.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  req.body.username = email; // Map email to username for passport-local strategy

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Authentication error:", err);
      return res.status(500).json({ message: "Internal server error during authentication." });
    }
    if (!user) {
      return res.status(401).json({ message: info?.message || "Invalid email or password." });
    }

    req.login(user, (loginErr) => {
      if (loginErr) {
        console.error("Session login error:", loginErr);
        return res.status(500).json({ message: "Login session creation failed." });
      }

      const redirectUrl = process.env.DASHBOARD_URL || "https://tradexadashboard.vercel.app";
      return res.status(200).json({
        message: "Login successful",
        redirectUrl,
        user: { id: user._id, name: user.name, email: user.email },
      });
    });
  })(req, res, next);
});

// LOGOUT ROUTE
app.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Logout failed." });
    }
    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        console.error("Session destroy error:", sessionErr);
        return res.status(500).json({ message: "Error clearing session." });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logout successful." });
    });
  });
});

// CURRENT USER ROUTE
app.get("/currentUser", (req, res) => {
  if (req.isAuthenticated() && req.user) {
    const { _id, name, email } = req.user;
    return res.status(200).json({ user: { id: _id, name, email } });
  }
  return res.status(401).json({ message: "User not authenticated." });
});

// ==================== TRADING & PORTFOLIO ROUTES ====================

// GET ALL HOLDINGS
app.get("/allHoldings", async (req, res) => {
  try {
    let query = {};
    if (req.isAuthenticated() && req.user) {
      // Find holdings belonging to user or global initial holdings
      const userHoldings = await HoldingModel.find({ user: req.user._id });
      if (userHoldings.length > 0) {
        return res.status(200).json(userHoldings);
      }
    }
    // Fallback to all holdings
    const holdings = await HoldingModel.find(query);
    res.status(200).json(holdings);
  } catch (error) {
    console.error("Error fetching holdings:", error);
    res.status(500).json({ message: "Error fetching holdings.", error: error.message });
  }
});

// GET ALL POSITIONS
app.get("/allPositions", async (req, res) => {
  try {
    let query = {};
    if (req.isAuthenticated() && req.user) {
      const userPositions = await PositionsModel.find({ user: req.user._id });
      if (userPositions.length > 0) {
        return res.status(200).json(userPositions);
      }
    }
    const positions = await PositionsModel.find(query);
    res.status(200).json(positions);
  } catch (error) {
    console.error("Error fetching positions:", error);
    res.status(500).json({ message: "Error fetching positions.", error: error.message });
  }
});

// GET ALL ORDERS
app.get("/orders", async (req, res) => {
  try {
    let query = {};
    if (req.isAuthenticated() && req.user) {
      const userOrders = await OrdersModel.find({ user: req.user._id }).sort({ date: -1 });
      if (userOrders.length > 0) {
        return res.status(200).json(userOrders);
      }
    }
    const orders = await OrdersModel.find(query).sort({ date: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders.", error: error.message });
  }
});

// PLACE A NEW ORDER (BUY / SELL)
app.post("/newOrder", async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;
    const action = (mode || req.body.action || "BUY").toUpperCase();
    const quantity = Number(qty);
    const orderPrice = Number(price);

    if (!name || isNaN(quantity) || quantity <= 0 || isNaN(orderPrice) || orderPrice < 0) {
      return res.status(400).json({ message: "Invalid order parameters." });
    }

    const userId = req.isAuthenticated() && req.user ? req.user._id : null;

    // Create and save the order
    const newOrder = new OrdersModel({
      user: userId,
      name,
      qty: quantity,
      price: orderPrice,
      action,
      date: new Date(),
    });
    await newOrder.save();

    // Query condition for user-specific or general holding
    const holdingFilter = userId ? { name, user: userId } : { name };

    if (action === "BUY") {
      let existingHolding = await HoldingModel.findOne(holdingFilter);
      if (existingHolding) {
        const totalQty = existingHolding.qty + quantity;
        const newAvgPrice =
          (existingHolding.avg * existingHolding.qty + orderPrice * quantity) / totalQty;
        existingHolding.qty = totalQty;
        existingHolding.avg = Number(newAvgPrice.toFixed(2));
        existingHolding.price = orderPrice;
        await existingHolding.save();
      } else {
        const newHolding = new HoldingModel({
          user: userId,
          name,
          qty: quantity,
          avg: orderPrice,
          price: orderPrice,
          net: "+0.00%",
          day: "+0.00%",
        });
        await newHolding.save();
      }
    } else if (action === "SELL") {
      let existingHolding = await HoldingModel.findOne(holdingFilter);
      if (existingHolding) {
        if (existingHolding.qty <= quantity) {
          await HoldingModel.deleteOne({ _id: existingHolding._id });
        } else {
          existingHolding.qty -= quantity;
          existingHolding.price = orderPrice;
          await existingHolding.save();
        }
      }
    }

    return res.status(200).json({
      message: `${action} order placed successfully!`,
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Error placing order.", error: error.message });
  }
});

// DELETE A HOLDING
app.delete("/deleteHolding/:id", async (req, res) => {
  try {
    const holdingId = req.params.id;
    const deleted = await HoldingModel.findByIdAndDelete(holdingId);
    if (deleted) {
      res.status(200).json({ message: "Holding deleted successfully." });
    } else {
      res.status(404).json({ message: "Holding not found." });
    }
  } catch (error) {
    console.error("Error deleting holding:", error);
    res.status(500).json({ message: "Error deleting holding.", error: error.message });
  }
});

// PORTFOLIO SUMMARY (DYNAMIC CALCULATION)
app.get("/api/summary", async (req, res) => {
  try {
    const username = req.isAuthenticated() && req.user ? req.user.name : "User";
    const userId = req.isAuthenticated() && req.user ? req.user._id : null;

    const holdingFilter = userId ? { user: userId } : {};
    const holdings = await HoldingModel.find(holdingFilter);

    const investment = holdings.reduce((acc, h) => acc + (h.avg || 0) * (h.qty || 0), 0);
    const currentValue = holdings.reduce((acc, h) => acc + (h.price || h.avg || 0) * (h.qty || 0), 0);
    const profitLoss = currentValue - investment;
    const profitPercentage = investment > 0 ? (profitLoss / investment) * 100 : 0;

    res.status(200).json({
      username,
      marginAvailable: 4.04,
      marginsUsed: Number((investment / 1000).toFixed(2)),
      openingBalance: 4.04,
      holdingsCount: holdings.length,
      profitLoss: Number((profitLoss / 1000).toFixed(2)),
      profitPercentage: Number(profitPercentage.toFixed(2)),
      currentValue: Number((currentValue / 1000).toFixed(2)),
      investment: Number((investment / 1000).toFixed(2)),
    });
  } catch (error) {
    console.error("Error calculating summary:", error);
    res.status(500).json({ message: "Error generating summary.", error: error.message });
  }
});

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});

// ==================== UNIFIED STATIC SERVING (ALL-IN-ONE) ====================
const frontendDist = path.join(__dirname, "../frontend/dist");
const dashboardDist = path.join(__dirname, "../dashboard/dist");

// Serve Dashboard build at /dashboard
if (fs.existsSync(dashboardDist)) {
  app.use("/dashboard", express.static(dashboardDist));
  app.get(["/dashboard", "/dashboard/*"], (req, res) => {
    res.sendFile(path.join(dashboardDist, "index.html"));
  });
}

// Serve Frontend build at /
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});