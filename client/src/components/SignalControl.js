import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SignalControl.css';

const SignalControl = ({ trafficData }) => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSignal, setEditingSignal] = useState(null);
  const [timing, setTiming] = useState({ red: 30, yellow: 5, green: 25 });

  useEffect(() => {
    if (trafficData && trafficData.signals) {
      setSignals(trafficData.signals);
      setLoading(false);
    }
  }, [trafficData]);

  const handleStateChange = async (signalId, newState) => {
    try {
      await axios.put(`http://localhost:5000/api/signals/${signalId}/state`, {
        state: newState
      });
      // Update local state
      setSignals(signals.map(s => 
        s.signalId === signalId ? { ...s, currentState: newState } : s
      ));
    } catch (error) {
      console.error('Error updating signal state:', error);
      alert('Failed to update signal state');
    }
  };

  const handleTimingChange = async (signalId) => {
    try {
      await axios.put(`http://localhost:5000/api/signals/${signalId}/timing`, {
        timing
      });
      // Update local state
      setSignals(signals.map(s => 
        s.signalId === signalId ? { ...s, timing: { ...timing } } : s
      ));
      setEditingSignal(null);
    } catch (error) {
      console.error('Error updating signal timing:', error);
      alert('Failed to update signal timing');
    }
  };

  const startEditing = (signal) => {
    setEditingSignal(signal.signalId);
    setTiming(signal.timing);
  };

  if (loading) {
    return <div className="loading">Loading signals...</div>;
  }

  return (
    <div className="signal-control">
      <h2>Traffic Signal Control</h2>
      <p className="subtitle">Monitor and control traffic signals in real-time</p>

      <div className="signals-control-grid">
        {signals.map(signal => {
          const signalData = trafficData?.trafficData?.find(td => td.signalId === signal.signalId);
          const isEditing = editingSignal === signal.signalId;

          return (
            <div key={signal.signalId} className="signal-control-card">
              <div className="signal-control-header">
                <h3>{signal.location.name}</h3>
                <div className={`signal-status-badge ${signal.currentState}`}>
                  {signal.currentState.toUpperCase()}
                </div>
              </div>

              <div className="signal-control-info">
                <p><strong>Signal ID:</strong> {signal.signalId}</p>
                <p><strong>Status:</strong> {signal.status}</p>
                <p><strong>Traffic Density:</strong> {signal.trafficDensity.toFixed(1)}%</p>
                {signalData && (
                  <>
                    <p><strong>Vehicles:</strong> {signalData.vehicleCount}</p>
                    <p><strong>Congestion:</strong> <span className={`congestion-badge ${signalData.congestionLevel}`}>{signalData.congestionLevel}</span></p>
                  </>
                )}
              </div>

              <div className="signal-control-actions">
                <h4>Change State</h4>
                <div className="state-buttons">
                  <button
                    className={`state-btn ${signal.currentState === 'red' ? 'active' : ''}`}
                    onClick={() => handleStateChange(signal.signalId, 'red')}
                  >
                    Red
                  </button>
                  <button
                    className={`state-btn ${signal.currentState === 'yellow' ? 'active' : ''}`}
                    onClick={() => handleStateChange(signal.signalId, 'yellow')}
                  >
                    Yellow
                  </button>
                  <button
                    className={`state-btn ${signal.currentState === 'green' ? 'active' : ''}`}
                    onClick={() => handleStateChange(signal.signalId, 'green')}
                  >
                    Green
                  </button>
                </div>
              </div>

              <div className="signal-control-timing">
                <div className="timing-header">
                  <h4>Timing Configuration</h4>
                  {!isEditing ? (
                    <button className="edit-btn" onClick={() => startEditing(signal)}>
                      Edit
                    </button>
                  ) : (
                    <div className="timing-actions">
                      <button className="save-btn" onClick={() => handleTimingChange(signal.signalId)}>
                        Save
                      </button>
                      <button className="cancel-btn" onClick={() => setEditingSignal(null)}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="timing-inputs">
                    <div className="timing-input">
                      <label>Red (seconds)</label>
                      <input
                        type="number"
                        value={timing.red}
                        onChange={(e) => setTiming({ ...timing, red: parseInt(e.target.value) })}
                        min="10"
                        max="60"
                      />
                    </div>
                    <div className="timing-input">
                      <label>Yellow (seconds)</label>
                      <input
                        type="number"
                        value={timing.yellow}
                        onChange={(e) => setTiming({ ...timing, yellow: parseInt(e.target.value) })}
                        min="3"
                        max="10"
                      />
                    </div>
                    <div className="timing-input">
                      <label>Green (seconds)</label>
                      <input
                        type="number"
                        value={timing.green}
                        onChange={(e) => setTiming({ ...timing, green: parseInt(e.target.value) })}
                        min="10"
                        max="60"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="timing-display">
                    <p>Red: <strong>{signal.timing.red}s</strong></p>
                    <p>Yellow: <strong>{signal.timing.yellow}s</strong></p>
                    <p>Green: <strong>{signal.timing.green}s</strong></p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SignalControl;

