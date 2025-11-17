const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Traffic Management System API is running' });
});

// Database connection (optional - system works without MongoDB)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('MongoDB connected successfully');
  }).catch((err) => {
    console.log('MongoDB connection error (continuing without database):', err.message);
  });
} else {
  console.log('MongoDB not configured - using in-memory data storage');
}

// Routes
app.use('/api/traffic', require('./routes/traffic'));
app.use('/api/signals', require('./routes/signals'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/analytics', require('./routes/analytics'));

// Real-time traffic data simulation
const trafficSimulator = require('./utils/trafficSimulator');
trafficSimulator.start(io);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  socket.on('request-traffic-data', () => {
    socket.emit('traffic-data', trafficSimulator.getCurrentData());
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

