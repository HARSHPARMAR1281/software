import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = ({ trafficData }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Base API URL (works in Vercel + locally)
  const API_BASE_URL =
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/analytics/overview`);
      setAnalytics(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!trafficData || !analytics) return <div className="loading">Waiting for data...</div>;

  return (
    <div className="dashboard">
      <h2>Traffic Dashboard</h2>

      {/* ------- STATS ------- */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🚦</div>
          <div className="stat-content">
            <h3>Total Signals</h3>
            <p className="stat-value">{analytics.totalSignals}</p>
            <p className="stat-subtitle">{analytics.activeSignals} Active</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚗</div>
          <div className="stat-content">
            <h3>Total Vehicles</h3>
            <p className="stat-value">{analytics.totalVehicles}</p>
            <p className="stat-subtitle">Currently on roads</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Average Density</h3>
            <p className="stat-value">{analytics.averageDensity.toFixed(1)}%</p>
            <p className="stat-subtitle">Traffic density</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <h3>Average Speed</h3>
            <p className="stat-value">{analytics.averageSpeed.toFixed(1)} km/h</p>
            <p className="stat-subtitle">Vehicle speed</p>
          </div>
        </div>
      </div>

      {/* ------- SIGNAL STATES ------- */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Signal States</h3>
          <div className="signal-states">
            <div className="signal-state-item">
              <div className="signal-indicator red"></div>
              <span>Red: {analytics.signalsByState.red}</span>
            </div>
            <div className="signal-state-item">
              <div className="signal-indicator yellow"></div>
              <span>Yellow: {analytics.signalsByState.yellow}</span>
            </div>
            <div className="signal-state-item">
              <div className="signal-indicator green"></div>
              <span>Green: {analytics.signalsByState.green}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Congestion Levels</h3>
          <div className="congestion-levels">
            <div className="congestion-item">
              <div
                className="congestion-bar low"
                style={{ width: `${(analytics.congestionLevels.low / analytics.totalSignals) * 100}%` }}
              ></div>
              <span>Low: {analytics.congestionLevels.low}</span>
            </div>

            <div className="congestion-item">
              <div
                className="congestion-bar medium"
                style={{ width: `${(analytics.congestionLevels.medium / analytics.totalSignals) * 100}%` }}
              ></div>
              <span>Medium: {analytics.congestionLevels.medium}</span>
            </div>

            <div className="congestion-item">
              <div
                className="congestion-bar high"
                style={{ width: `${(analytics.congestionLevels.high / analytics.totalSignals) * 100}%` }}
              ></div>
              <span>High: {analytics.congestionLevels.high}</span>
            </div>

            <div className="congestion-item">
              <div
                className="congestion-bar severe"
                style={{ width: `${(analytics.congestionLevels.severe / analytics.totalSignals) * 100}%` }}
              ></div>
              <span>Severe: {analytics.congestionLevels.severe}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ------- SIGNALS LIST ------- */}
      <div className="dashboard-card">
        <h3>Traffic Signals</h3>
        <div className="signals-list">
          {trafficData.signals.map(signal => {
            const signalData = trafficData.trafficData.find(td => td.signalId === signal.signalId);
            return (
              <div key={signal.signalId} className="signal-card">
                <div className="signal-header">
                  <h4>{signal.location.name}</h4>
                  <div className={`signal-status ${signal.currentState}`}>
                    {signal.currentState.toUpperCase()}
                  </div>
                </div>

                <div className="signal-details">
                  <p><strong>Signal ID:</strong> {signal.signalId}</p>
                  <p><strong>Density:</strong> {signal.trafficDensity.toFixed(1)}%</p>
                  <p><strong>Vehicles:</strong> {signalData?.vehicleCount || 0}</p>
                  <p><strong>Speed:</strong> {signalData?.averageSpeed?.toFixed(1) || 0} km/h</p>
                  <p><strong>Congestion:</strong>
                    <span className={`congestion-badge ${signalData?.congestionLevel}`}>
                      {signalData?.congestionLevel || 'low'}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
