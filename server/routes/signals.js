const express = require('express');
const router = express.Router();
const trafficSimulator = require('../utils/trafficSimulator');

// Get all signals
router.get('/', (req, res) => {
  try {
    const data = trafficSimulator.getCurrentData();
    res.json(data.signals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get signal by ID
router.get('/:signalId', (req, res) => {
  try {
    const { signalId } = req.params;
    const data = trafficSimulator.getCurrentData();
    const signal = data.signals.find(s => s.signalId === signalId);
    
    if (!signal) {
      return res.status(404).json({ error: 'Signal not found' });
    }
    
    res.json(signal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update signal timing
router.put('/:signalId/timing', (req, res) => {
  try {
    const { signalId } = req.params;
    const { timing } = req.body;
    
    const updatedSignal = trafficSimulator.updateSignalTiming(signalId, timing);
    
    if (!updatedSignal) {
      return res.status(404).json({ error: 'Signal not found' });
    }
    
    res.json(updatedSignal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update signal state
router.put('/:signalId/state', (req, res) => {
  try {
    const { signalId } = req.params;
    const { state } = req.body;
    
    if (!['red', 'yellow', 'green'].includes(state)) {
      return res.status(400).json({ error: 'Invalid state. Must be red, yellow, or green' });
    }
    
    const updatedSignal = trafficSimulator.updateSignalState(signalId, state);
    
    if (!updatedSignal) {
      return res.status(404).json({ error: 'Signal not found' });
    }
    
    res.json(updatedSignal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

