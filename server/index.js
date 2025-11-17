const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// --------------------- FIXED CORS FOR DEPLOYMENT ---------------------
app.use(
  cors({
    origin: "https://software-gold.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// --------------------- SOCKET.IO CORS ---------------------
const io = socketIo(server, {
  cors: {
    origin: "https://software-gold.vercel.app",
    methods: ["GET", "POST"],
  },
});

// --------------------- HEALTH CHECK ---------------------
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Traffic Management System Running" });
});

// --------------------- DATABASE (OPTIONAL) ---------------------
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) =>
      console.log("MongoDB error (running without DB):", err.message)
    );
}

// --------------------- ROUTES ---------------------
app.use("/api/traffic", require("./routes/traffic"));
app.use("/api/signals", require("./routes/signals"));
app.use("/api/vehicles", require("./routes/vehicles"));
app.use("/api/analytics", require("./routes/analytics"));

// --------------------- TRAFFIC SIMULATOR ---------------------
const trafficSimulator = require("./utils/trafficSimulator");
trafficSimulator.start(io);

// --------------------- SOCKET EVENTS ---------------------
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });

  socket.on("request-traffic-data", () => {
    socket.emit("traffic-data", trafficSimulator.getCurrentData());
  });
});

// --------------------- PORT FOR RENDER ---------------------
const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
