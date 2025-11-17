import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Analytics.css';

const Analytics = ({ trafficData }) => {
  const [analytics, setAnalytics] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historicalData, setHistoricalData] = useState([]);

  const COLORS = ['#27ae60', '#f39c12', '#e67e22', '#e74c3c'];

  useEffect(() => {
    fetchAnalytics();
    fetchHotspots();
    const interval = setInterval(() => {
      fetchAnalytics();
      fetchHotspots();
      // Simulate historical data
      if (analytics) {
        setHistoricalData(prev => [...prev.slice(-19), {
          time: new Date().toLocaleTimeString(),
          density: analytics.averageDensity,
          speed: analytics.averageSpeed,
          vehicles: analytics.totalVehicles
        }]);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [analytics]);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/analytics/overview');
      setAnalytics(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  const fetchHotspots = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/analytics/hotspots');
      setHotspots(response.data);
    } catch (error) {
      console.error('Error fetching hotspots:', error);
    }
  };

  if (loading || !analytics) {
    return <div className="loading">Loading analytics...</div>;
  }

  const congestionData = [
    { name: 'Low', value: analytics.congestionLevels.low, color: '#27ae60' },
    { name: 'Medium', value: analytics.congestionLevels.medium, color: '#f39c12' },
    { name: 'High', value: analytics.congestionLevels.high, color: '#e67e22' },
    { name: 'Severe', value: analytics.congestionLevels.severe, color: '#e74c3c' }
  ];

  const signalStateData = [
    { name: 'Red', value: analytics.signalsByState.red },
    { name: 'Yellow', value: analytics.signalsByState.yellow },
    { name: 'Green', value: analytics.signalsByState.green }
  ];

  const hotspotData = hotspots.map(hotspot => ({
    name: hotspot.location.name,
    density: hotspot.trafficDensity,
    vehicles: hotspot.vehicleCount
  }));

  return (
    <div className="analytics">
      <h2>Traffic Analytics</h2>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Traffic Density Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData.length > 0 ? historicalData : [{ time: 'Now', density: analytics.averageDensity }]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="density" stroke="#3498db" strokeWidth={2} name="Density %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="analytics-card">
          <h3>Average Speed Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData.length > 0 ? historicalData : [{ time: 'Now', speed: analytics.averageSpeed }]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="speed" stroke="#27ae60" strokeWidth={2} name="Speed km/h" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="analytics-card">
          <h3>Congestion Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={congestionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {congestionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="analytics-card">
          <h3>Signal States</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={signalStateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3498db" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="analytics-card">
          <h3>Vehicle Count Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData.length > 0 ? historicalData : [{ time: 'Now', vehicles: analytics.totalVehicles }]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="vehicles" stroke="#e67e22" strokeWidth={2} name="Vehicles" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {hotspotData.length > 0 && (
          <div className="analytics-card">
            <h3>Congestion Hotspots</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hotspotData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="density" fill="#e74c3c" name="Density %" />
                <Bar dataKey="vehicles" fill="#f39c12" name="Vehicles" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="analytics-summary">
        <h3>Summary Statistics</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Total Signals</span>
            <span className="summary-value">{analytics.totalSignals}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Active Signals</span>
            <span className="summary-value">{analytics.activeSignals}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Vehicles</span>
            <span className="summary-value">{analytics.totalVehicles}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Average Density</span>
            <span className="summary-value">{analytics.averageDensity.toFixed(1)}%</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Average Speed</span>
            <span className="summary-value">{analytics.averageSpeed.toFixed(1)} km/h</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Hotspots</span>
            <span className="summary-value">{hotspots.length}</span>
          </div>
        </div>
      </div>

      {hotspots.length > 0 && (
        <div className="hotspots-list">
          <h3>Congestion Hotspots</h3>
          <div className="hotspots-grid">
            {hotspots.map((hotspot, index) => (
              <div key={index} className="hotspot-card">
                <h4>{hotspot.location.name}</h4>
                <p><strong>Signal ID:</strong> {hotspot.signalId}</p>
                <p><strong>Traffic Density:</strong> {hotspot.trafficDensity.toFixed(1)}%</p>
                <p><strong>Vehicles:</strong> {hotspot.vehicleCount}</p>
                <p><strong>Congestion:</strong> <span className={`congestion-badge ${hotspot.congestionLevel}`}>{hotspot.congestionLevel}</span></p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;

