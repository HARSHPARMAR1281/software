import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Analytics.css';

// 🔥 FIXED API URL FOR DEPLOYMENT
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
      const response = await axios.get(`${API_URL}/api/analytics/overview`);
      setAnalytics(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  const fetchHotspots = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/analytics/hotspots`);
      setHotspots(response.data);
    } catch (error) {
      console.error('Error fetching hotspots:', error);
    }
  };
}