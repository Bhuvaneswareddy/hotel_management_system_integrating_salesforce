const express = require('express');
const cors = require('cors'); 
const app = express();
require('dotenv').config();
const sequelize = require('./config/db');

const branchRoutes = require('./routes/branchRoutes');
const roomRoutes = require('./routes/roomRoutes');
const menuRoutes = require('./routes/menuRoutes');
const foodRoutes = require('./routes/FoodOrderRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const paymentRoutes = require("./routes/paymentRoutes");


// -----------------------------
// Middleware
// -----------------------------
app.use(express.json());


// Enable CORS for frontend
app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server requests (Postman, etc.)
      if (!origin) return callback(null, true);

      // allow ALL Vercel deployments (production + preview)
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      // allow local development
      if (origin === "http://localhost:3000") {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);


// -----------------------------
// Routes
// -----------------------------
app.use('/api/auth', authRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/menuItems', menuRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/service', serviceRoutes);
app.use("/api/payments", paymentRoutes);


// -----------------------------
// Start server
// -----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log('✅ Database connected successfully!');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
});
