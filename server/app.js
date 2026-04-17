// server.js
const express = require("express");
require("dotenv").config();
const connectDB = require("./database/DB");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
const user = require("./Routes/user");
const book = require("./Routes/book");
const chapter = require("./Routes/chapter");
const reading = require("./Routes/reading");
const wallet = require("./Routes/wallet");
const review = require("./Routes/review");

// Connect to Database
connectDB().then(() => {
  const { initBloomFilter } = require('./utils/bloomFilter');
  initBloomFilter();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/v1", user);
app.use("/api/v1", book);
app.use("/api/v1", chapter);
app.use("/api/v1", reading);
app.use("/api/v1", wallet);
app.use("/api/v1", review);
// Routes

app.get("/", (req, res) => {
  res.send("Hello from server");
});

// Start Server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
