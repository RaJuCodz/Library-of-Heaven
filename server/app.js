// server.js
const express = require("express");
require("dotenv").config();
const connectDB = require("./database/DB");

const app = express();
const PORT = process.env.PORT || 5000;
const user = require("./Routes/user");
const book = require("./Routes/book");
// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use("/api/v1", user);
app.use("/api/v1", book);
// Routes

app.get("/", (req, res) => {
  res.send("Hello from server");
});

// Start Server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
