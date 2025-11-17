const mongoose = require('mongoose');

const trafficDataSchema = new mongoose.Schema({
  signalId: {
    type: String,
    required: true
  },
  vehicleCount: {
    type: Number,
    default: 0
  },
  averageSpeed: {
    type: Number,
    default: 0
  },
  trafficDensity: {
    type: Number,
    default: 0
  },
  congestionLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'severe'],
    default: 'low'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TrafficData', trafficDataSchema);

