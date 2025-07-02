const express = require("express");
const cors = require("cors");
const user = require("../server/Routes/user");
const book = require("../server/Routes/book");
const favourite = require("../server/Routes/favor");
const cart = require("../server/Routes/carts");
const order = require("../server/Routes/order");
const connectDB = require("../server/database/DB");

// Ensure DB connection is reused in serverless
let isConnected = false;
async function ensureDBConnected() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(async (req, res, next) => {
  await ensureDBConnected();
  next();
});
app.use("/api/v1", user);
app.use("/api/v1", book);
app.use("/api/v1", favourite);
app.use("/api/v1", cart);
app.use("/api/v1", order);

app.get("/api", (req, res) => {
  res.send("Hello from Vercel Serverless API");
});

module.exports = app;
