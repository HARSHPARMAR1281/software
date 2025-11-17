# Traffic Management System

A comprehensive real-time traffic management system with monitoring, signal control, and analytics capabilities.

## Features

- 🚦 **Real-time Traffic Monitoring**: Live traffic data updates every 2 seconds
- 🗺️ **Interactive Map**: Visualize traffic signals and vehicles on an interactive map
- 🎛️ **Signal Control**: Manually control traffic signals and adjust timing
- 📊 **Analytics Dashboard**: Comprehensive analytics with charts and graphs
- 🔄 **WebSocket Support**: Real-time data updates using Socket.IO
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- Node.js with Express
- Socket.IO for real-time communication
- MongoDB for data persistence (optional)
- Traffic simulation engine

### Frontend
- React 18
- React Router for navigation
- Socket.IO Client for real-time updates
- Leaflet for maps
- Recharts for data visualization
- Axios for API calls

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (optional, for data persistence)

### Setup

1. **Clone the repository** (or navigate to the project directory)

2. **Install dependencies**:
   ```bash
   npm run install-all
   ```

   This will install dependencies for the root, server, and client.

3. **Configure environment variables**:
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/traffic-management
   NODE_ENV=development
   ```

   Note: MongoDB is optional. The system works without it using in-memory data.

4. **Start the development servers**:
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend (port 3000).

   Alternatively, you can start them separately:
   ```bash
   # Terminal 1 - Backend
   npm run server

   # Terminal 2 - Frontend
   npm run client
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`

2. **Dashboard**: View real-time traffic statistics and signal status

3. **Map**: See traffic signals and vehicles on an interactive map with congestion visualization

4. **Signals**: Control traffic signals manually, change states, and adjust timing

5. **Analytics**: View detailed analytics with charts and graphs

## API Endpoints

### Traffic Data
- `GET /api/traffic/data` - Get all traffic data
- `GET /api/traffic/data/:signalId` - Get traffic data for a specific signal
- `GET /api/traffic/signals` - Get all signals
- `GET /api/traffic/vehicles` - Get all vehicles

### Signal Control
- `GET /api/signals` - Get all signals
- `GET /api/signals/:signalId` - Get signal by ID
- `PUT /api/signals/:signalId/state` - Update signal state
- `PUT /api/signals/:signalId/timing` - Update signal timing

### Analytics
- `GET /api/analytics/overview` - Get traffic analytics overview
- `GET /api/analytics/hotspots` - Get congestion hotspots

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/signal/:signalId` - Get vehicles by signal ID

## Project Structure

```
traffic-management-system/
├── server/
│   ├── index.js              # Main server file
│   ├── models/               # MongoDB models
│   ├── routes/               # API routes
│   ├── utils/                # Utility functions
│   │   └── trafficSimulator.js  # Traffic simulation engine
│   └── package.json
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Dashboard.js
│   │   │   ├── TrafficMap.js
│   │   │   ├── SignalControl.js
│   │   │   └── Analytics.js
│   │   ├── App.js            # Main App component
│   │   └── index.js          # Entry point
│   └── package.json
├── package.json              # Root package.json
└── README.md
```

## Features in Detail

### Real-time Updates
The system uses WebSockets to provide real-time updates every 2 seconds. All connected clients receive updates simultaneously.

### Traffic Simulation
The traffic simulator generates realistic traffic data including:
- Signal state changes
- Traffic density fluctuations
- Vehicle generation and movement
- Speed and congestion calculations

### Signal Control
Traffic operators can:
- Manually change signal states (red, yellow, green)
- Adjust timing for each signal phase
- Monitor signal status in real-time

### Analytics
Comprehensive analytics include:
- Traffic density trends
- Average speed monitoring
- Congestion distribution
- Signal state statistics
- Hotspot identification

## Development

### Adding New Features

1. **Backend**: Add new routes in `server/routes/` and update the simulator if needed
2. **Frontend**: Add new components in `client/src/components/` and update routing in `App.js`

### Customization

- **Signal Locations**: Modify `server/utils/trafficSimulator.js` to add/remove signals
- **Update Frequency**: Change the interval in `trafficSimulator.js` (default: 2000ms)
- **Styling**: Modify CSS files in `client/src/components/`

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use:
- Change the port in `server/.env` (backend)
- Update the proxy in `client/package.json` (frontend)

### MongoDB Connection Issues
The system works without MongoDB. If you want to use MongoDB:
- Ensure MongoDB is running
- Update the `MONGODB_URI` in `server/.env`

### Socket.IO Connection Issues
- Ensure the backend server is running
- Check CORS settings in `server/index.js`
- Verify the socket URL in `client/src/App.js`

## License

MIT License - feel free to use this project for learning and development purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Historical data storage and retrieval
- [ ] Alert system for traffic incidents
- [ ] Machine learning for traffic prediction
- [ ] Mobile app support
- [ ] Integration with real traffic sensors
- [ ] Traffic route optimization
- [ ] Emergency vehicle priority system

