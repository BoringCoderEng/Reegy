console.log("App loaded");
// Why load per-environment: manually swapping test/live keys before
// deploying is exactly the step that eventually gets forgotten.
require("dotenv").config({ path: `.env.${process.env.NODE_ENV || "development"}` });
const express = require('express');
const cookieParser = require('cookie-parser');
const  cors = require('cors');

const authRoutes = require('./routes/auth.routes.js');
const foodRoutes = require('./routes/food.routes.js');

const foodpartner = require('./routes/food-partner.routes.js');

const app = express();
app.use((req, res, next) => {
    console.log("➡️ REQUEST:", req.method, req.url);
    next();
});

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.get("/", (req, res) => {
    res.send('Hello World!');
});
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodpartner);
app.use("/api/cart", require("./routes/cart.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/payments", require("./routes/payment.routes"));

module.exports = app;