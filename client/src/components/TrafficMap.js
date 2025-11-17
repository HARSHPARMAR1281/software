import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './TrafficMap.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const TrafficMap = ({ trafficData }) => {
  const mapRef = useRef(null);

  const getSignalColor = (state) => {
    switch (state) {
      case 'red': return '#e74c3c';
      case 'yellow': return '#f39c12';
      case 'green': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const getCongestionColor = (level) => {
    switch (level) {
      case 'low': return '#27ae60';
      case 'medium': return '#f39c12';
      case 'high': return '#e67e22';
      case 'severe': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getCongestionRadius = (density) => {
    return Math.max(50, density * 5);
  };

  if (!trafficData || !trafficData.signals || trafficData.signals.length === 0) {
    return (
      <div className="traffic-map-container">
        <div className="loading">Loading map data...</div>
      </div>
    );
  }

  const center = trafficData.signals[0]?.location || { lat: 28.6139, lng: 77.2090 };

  return (
    <div className="traffic-map-container">
      <h2>Traffic Map</h2>
      <div className="map-legend">
        <div className="legend-item">
          <div className="legend-color red"></div>
          <span>Red Signal</span>
        </div>
        <div className="legend-item">
          <div className="legend-color yellow"></div>
          <span>Yellow Signal</span>
        </div>
        <div className="legend-item">
          <div className="legend-color green"></div>
          <span>Green Signal</span>
        </div>
        <div className="legend-item">
          <div className="legend-circle low"></div>
          <span>Low Congestion</span>
        </div>
        <div className="legend-item">
          <div className="legend-circle high"></div>
          <span>High Congestion</span>
        </div>
      </div>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        style={{ height: '600px', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {trafficData.signals.map(signal => {
          const signalData = trafficData.trafficData?.find(td => td.signalId === signal.signalId);
          const congestionLevel = signalData?.congestionLevel || 'low';
          const density = signal.trafficDensity || 0;

          return (
            <React.Fragment key={signal.signalId}>
              <Circle
                center={[signal.location.lat, signal.location.lng]}
                radius={getCongestionRadius(density)}
                pathOptions={{
                  color: getCongestionColor(congestionLevel),
                  fillColor: getCongestionColor(congestionLevel),
                  fillOpacity: 0.3,
                  weight: 2
                }}
              />
              <Marker
                position={[signal.location.lat, signal.location.lng]}
                icon={L.divIcon({
                  className: 'custom-marker',
                  html: `<div style="background-color: ${getSignalColor(signal.currentState)}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                  iconSize: [20, 20],
                  iconAnchor: [10, 10]
                })}
              >
                <Popup>
                  <div className="popup-content">
                    <h3>{signal.location.name}</h3>
                    <p><strong>Signal ID:</strong> {signal.signalId}</p>
                    <p><strong>State:</strong> <span style={{ color: getSignalColor(signal.currentState), fontWeight: 'bold' }}>{signal.currentState.toUpperCase()}</span></p>
                    <p><strong>Traffic Density:</strong> {density.toFixed(1)}%</p>
                    <p><strong>Vehicles:</strong> {signalData?.vehicleCount || 0}</p>
                    <p><strong>Average Speed:</strong> {signalData?.averageSpeed.toFixed(1) || 0} km/h</p>
                    <p><strong>Congestion:</strong> <span style={{ color: getCongestionColor(congestionLevel), fontWeight: 'bold' }}>{congestionLevel.toUpperCase()}</span></p>
                    <p><strong>Status:</strong> {signal.status}</p>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
        {trafficData.vehicles && trafficData.vehicles.slice(0, 50).map((vehicle, index) => (
          <Marker
            key={`${vehicle.vehicleId}-${index}`}
            position={[vehicle.location.lat, vehicle.location.lng]}
            icon={L.divIcon({
              className: 'vehicle-marker',
              html: `<div style="font-size: 12px;">🚗</div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })}
          >
            <Popup>
              <div className="popup-content">
                <p><strong>Vehicle ID:</strong> {vehicle.vehicleId}</p>
                <p><strong>Type:</strong> {vehicle.type}</p>
                <p><strong>Speed:</strong> {vehicle.speed} km/h</p>
                <p><strong>Signal:</strong> {vehicle.signalId}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default TrafficMap;

