import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import io from 'socket.io-client';
import Dashboard from './components/Dashboard';
import TrafficMap from './components/TrafficMap';
import SignalControl from './components/SignalControl';
import Analytics from './components/Analytics';
import './App.css';

// FIXED SOCKET.IO URL
const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

function App() {
  const [trafficData, setTrafficData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      socket.emit('request-traffic-data');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socket.on('traffic-update', (data) => {
      setTrafficData(data);
    });

    socket.on('traffic-data', (data) => {
      setTrafficData(data);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('traffic-update');
      socket.off('traffic-data');
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-logo">🚦 Traffic Management System</h1>
            <div className="nav-links">
              <Link to="/" className="nav-link">Dashboard</Link>
              <Link to="/map" className="nav-link">Map</Link>
              <Link to="/signals" className="nav-link">Signals</Link>
              <Link to="/analytics" className="nav-link">Analytics</Link>
            </div>
            <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard trafficData={trafficData} />} />
            <Route path="/map" element={<TrafficMap trafficData={trafficData} />} />
            <Route path="/signals" element={<SignalControl trafficData={trafficData} />} />
            <Route path="/analytics" element={<Analytics trafficData={trafficData} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
