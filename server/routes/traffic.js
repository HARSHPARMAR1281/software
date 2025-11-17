const express = require('express');
const router = express.Router();
const trafficSimulator = require('../utils/trafficSimulator');

// Get all traffic data
router.get('/data', (req, res) => {
  try {
    const data = trafficSimulator.getCurrentData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get traffic data for a specific signal
router.get('/data/:signalId', (req, res) => {
  try {
    const { signalId } = req.params;
    const data = trafficSimulator.getCurrentData();
    const signalData = data.trafficData.find(td => td.signalId === signalId);
    
    if (!signalData) {
      return res.status(404).json({ error: 'Signal not found' });
    }
    
    res.json(signalData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all signals
router.get('/signals', (req, res) => {
  try {
    const data = trafficSimulator.getCurrentData();
    res.json(data.signals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all vehicles
router.get('/vehicles', (req, res) => {
  try {
    const data = trafficSimulator.getCurrentData();
    res.json(data.vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

