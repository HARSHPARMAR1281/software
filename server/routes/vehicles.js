const express = require('express');
const router = express.Router();
const trafficSimulator = require('../utils/trafficSimulator');

// Get all vehicles
router.get('/', (req, res) => {
  try {
    const data = trafficSimulator.getCurrentData();
    res.json(data.vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get vehicles by signal ID
router.get('/signal/:signalId', (req, res) => {
  try {
    const { signalId } = req.params;
    const data = trafficSimulator.getCurrentData();
    const vehicles = data.vehicles.filter(v => v.signalId === signalId);
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

