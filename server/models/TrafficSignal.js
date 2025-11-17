const mongoose = require('mongoose');

const trafficSignalSchema = new mongoose.Schema({
  signalId: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    name: { type: String, required: true }
  },
  currentState: {
    type: String,
    enum: ['red', 'yellow', 'green'],
    default: 'red'
  },
  timing: {
    red: { type: Number, default: 30 },
    yellow: { type: Number, default: 5 },
    green: { type: Number, default: 25 }
  },
  trafficDensity: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'offline'],
    default: 'active'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TrafficSignal', trafficSignalSchema);

