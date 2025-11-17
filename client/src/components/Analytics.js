import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import './Analytics.css';

// 🔥 FIXED API URL
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

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

      if (analytics) {
        setHistoricalData(prev => [
          ...prev.slice(-19),
          {
            time: new Date().toLocaleTimeString(),
            density: analytics.averageDensity,
            speed: analytics.averageSpeed,
            vehicles: analytics.totalVehicles
          }
        ]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [analytics]);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/analytics/overview`);
      setAnalytics(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setLoading(false);
    }
  };

  const fetchHotspots = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/analytics/hotspots`);
      setHotspots(response.data);
    } catch (error) {
      console.error("Error fetching hotspots:", error);
    }
  };

  if (loading) return <p>Loading analytics...</p>;

  return (
    <div className="analytics-container">

      <h2>Traffic Analytics Overview</h2>

      {/* ====== MAIN ANALYTICS INFO ====== */}
      <div className="analytics-cards">
        <div className="card">Average Speed: {analytics.averageSpeed} km/h</div>
        <div className="card">Average Density: {analytics.averageDensity}</div>
        <div className="card">Total Vehicles: {analytics.totalVehicles}</div>
      </div>

      {/* ====== HISTORICAL LINE CHART ====== */}
      <div className="chart-section">
        <h3>Real-Time Traffic Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="vehicles" stroke="#e74c3c" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ====== HOTSPOTS PIE CHART ====== */}
      <div className="chart-section">
        <h3>Congestion Hotspots</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={hotspots}
              dataKey="count"
              nameKey="location"
              outerRadius={120}
              fill="#8884d8"
              label
            >
              {hotspots.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default Analytics;
