// server.js
const express = require("express");
require("dotenv").config();
const connectDB = require("./database/DB");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
const user = require("./Routes/user");
const book = require("./Routes/book");
const favourite = require("./Routes/favor");
const cart = require("./Routes/carts");
const order = require("./Routes/order");
// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/v1", user);
app.use("/api/v1", book);
app.use("/api/v1", favourite);
app.use("/api/v1", cart);
app.use("/api/v1", order);
// Routes

app.get("/", (req, res) => {
  res.send("Hello from server");
});

// Start Server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
