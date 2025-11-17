class TrafficSimulator {
  constructor() {
    this.signals = [];
    this.vehicles = [];
    this.trafficData = {};
    this.initializeSignals();
    this.intervalId = null;
  }

  initializeSignals() {
    // Initialize with some default traffic signals
    this.signals = [
      {
        signalId: 'S001',
        location: { lat: 28.6139, lng: 77.2090, name: 'Main Street & 1st Avenue' },
        currentState: 'red',
        timing: { red: 30, yellow: 5, green: 25 },
        trafficDensity: 45,
        status: 'active'
      },
      {
        signalId: 'S002',
        location: { lat: 28.6149, lng: 77.2100, name: 'Park Avenue & 2nd Street' },
        currentState: 'green',
        timing: { red: 30, yellow: 5, green: 25 },
        trafficDensity: 65,
        status: 'active'
      },
      {
        signalId: 'S003',
        location: { lat: 28.6159, lng: 77.2110, name: 'Broadway & 3rd Avenue' },
        currentState: 'yellow',
        timing: { red: 30, yellow: 5, green: 25 },
        trafficDensity: 30,
        status: 'active'
      },
      {
        signalId: 'S004',
        location: { lat: 28.6169, lng: 77.2120, name: 'Market Street & 4th Avenue' },
        currentState: 'red',
        timing: { red: 30, yellow: 5, green: 25 },
        trafficDensity: 80,
        status: 'active'
      }
    ];

    // Initialize traffic data for each signal
    this.signals.forEach(signal => {
      this.trafficData[signal.signalId] = {
        signalId: signal.signalId,
        vehicleCount: Math.floor(Math.random() * 50) + 10,
        averageSpeed: Math.floor(Math.random() * 30) + 20,
        trafficDensity: signal.trafficDensity,
        congestionLevel: this.getCongestionLevel(signal.trafficDensity),
        timestamp: new Date()
      };
    });
  }

  getCongestionLevel(density) {
    if (density < 30) return 'low';
    if (density < 50) return 'medium';
    if (density < 70) return 'high';
    return 'severe';
  }

  updateSignalStates() {
    this.signals.forEach(signal => {
      const states = ['red', 'yellow', 'green'];
      const currentIndex = states.indexOf(signal.currentState);
      
      // Simple state machine - cycle through states
      if (Math.random() > 0.7) {
        const nextIndex = (currentIndex + 1) % states.length;
        signal.currentState = states[nextIndex];
      }
    });
  }

  updateTrafficDensity() {
    this.signals.forEach(signal => {
      // Simulate traffic density changes
      const change = (Math.random() - 0.5) * 10;
      signal.trafficDensity = Math.max(0, Math.min(100, signal.trafficDensity + change));
      
      // Update traffic data
      this.trafficData[signal.signalId] = {
        signalId: signal.signalId,
        vehicleCount: Math.floor(signal.trafficDensity / 2) + Math.floor(Math.random() * 20),
        averageSpeed: Math.max(10, 50 - signal.trafficDensity / 2),
        trafficDensity: signal.trafficDensity,
        congestionLevel: this.getCongestionLevel(signal.trafficDensity),
        timestamp: new Date()
      };
    });
  }

  generateVehicles() {
    // Generate random vehicles
    const vehicleTypes = ['car', 'truck', 'bus', 'motorcycle', 'bicycle'];
    this.vehicles = this.signals.flatMap(signal => {
      const vehicleCount = Math.floor(this.trafficData[signal.signalId].vehicleCount / 5);
      return Array.from({ length: vehicleCount }, (_, i) => ({
        vehicleId: `V${signal.signalId}-${i}`,
        type: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
        location: {
          lat: signal.location.lat + (Math.random() - 0.5) * 0.01,
          lng: signal.location.lng + (Math.random() - 0.5) * 0.01
        },
        speed: Math.floor(Math.random() * 40) + 20,
        direction: Math.floor(Math.random() * 360),
        signalId: signal.signalId,
        timestamp: new Date()
      }));
    });
  }

  start(io) {
    this.intervalId = setInterval(() => {
      this.updateSignalStates();
      this.updateTrafficDensity();
      this.generateVehicles();
      
      // Emit updated data to all connected clients
      io.emit('traffic-update', {
        signals: this.signals,
        vehicles: this.vehicles,
        trafficData: Object.values(this.trafficData),
        timestamp: new Date()
      });
    }, 2000); // Update every 2 seconds
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getCurrentData() {
    return {
      signals: this.signals,
      vehicles: this.vehicles,
      trafficData: Object.values(this.trafficData),
      timestamp: new Date()
    };
  }

  updateSignalTiming(signalId, timing) {
    const signal = this.signals.find(s => s.signalId === signalId);
    if (signal) {
      signal.timing = { ...signal.timing, ...timing };
      return signal;
    }
    return null;
  }

  updateSignalState(signalId, state) {
    const signal = this.signals.find(s => s.signalId === signalId);
    if (signal) {
      signal.currentState = state;
      return signal;
    }
    return null;
  }
}

const simulator = new TrafficSimulator();
module.exports = simulator;

