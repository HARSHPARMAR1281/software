const express = require('express');
const router = express.Router();
const trafficSimulator = require('../utils/trafficSimulator');

// Get traffic analytics
router.get('/overview', (req, res) => {
  try {
    const data = trafficSimulator.getCurrentData();
    const trafficData = Object.values(data.trafficData);
    
    const analytics = {
      totalSignals: data.signals.length,
      activeSignals: data.signals.filter(s => s.status === 'active').length,
      totalVehicles: data.vehicles.length,
      averageDensity: trafficData.reduce((sum, td) => sum + td.trafficDensity, 0) / trafficData.length,
      averageSpeed: trafficData.reduce((sum, td) => sum + td.averageSpeed, 0) / trafficData.length,
      congestionLevels: {
        low: trafficData.filter(td => td.congestionLevel === 'low').length,
        medium: trafficData.filter(td => td.congestionLevel === 'medium').length,
        high: trafficData.filter(td => td.congestionLevel === 'high').length,
        severe: trafficData.filter(td => td.congestionLevel === 'severe').length
      },
      signalsByState: {
        red: data.signals.filter(s => s.currentState === 'red').length,
        yellow: data.signals.filter(s => s.currentState === 'yellow').length,
        green: data.signals.filter(s => s.currentState === 'green').length
      }
    };
    
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get congestion hotspots
router.get('/hotspots', (req, res) => {
  try {
    const data = trafficSimulator.getCurrentData();
    const hotspots = data.signals
      .map(signal => {
        const trafficData = data.trafficData.find(td => td.signalId === signal.signalId);
        return {
          signalId: signal.signalId,
          location: signal.location,
          trafficDensity: signal.trafficDensity,
          congestionLevel: trafficData ? trafficData.congestionLevel : 'low',
          vehicleCount: trafficData ? trafficData.vehicleCount : 0
        };
      })
      .filter(hotspot => hotspot.congestionLevel === 'high' || hotspot.congestionLevel === 'severe')
      .sort((a, b) => b.trafficDensity - a.trafficDensity);
    
    res.json(hotspots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

