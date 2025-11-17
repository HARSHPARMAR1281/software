const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['car', 'truck', 'bus', 'motorcycle', 'bicycle'],
    default: 'car'
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  speed: {
    type: Number,
    default: 0
  },
  direction: {
    type: Number,
    min: 0,
    max: 360
  },
  signalId: {
    type: String,
    ref: 'TrafficSignal'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);

