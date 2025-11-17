# Setup Guide

## Quick Start

1. **Install all dependencies**:
   ```bash
   npm run install-all
   ```

2. **Create environment file**:
   Create a file named `.env` in the `server` directory with the following content:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/traffic-management
   NODE_ENV=development
   ```
   
   Note: MongoDB is optional. The system works without it using in-memory data simulation.

3. **Start the application**:
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on http://localhost:5000
   - Frontend application on http://localhost:3000

4. **Open your browser**:
   Navigate to http://localhost:3000

## Manual Setup

If you prefer to run the servers separately:

### Backend Setup
```bash
cd server
npm install
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm start
```

## Troubleshooting

### Port Already in Use
- Change `PORT` in `server/.env` to a different port (e.g., 5001)
- Update the proxy in `client/package.json` to match

### MongoDB Connection
- The system works without MongoDB
- If you want to use MongoDB, make sure it's installed and running
- Update `MONGODB_URI` in `server/.env` if needed

### Socket.IO Connection Issues
- Ensure backend is running on port 5000
- Check CORS settings in `server/index.js`
- Verify socket URL in `client/src/App.js`

## Features

- ✅ Real-time traffic monitoring
- ✅ Interactive map with Leaflet
- ✅ Signal control panel
- ✅ Analytics dashboard
- ✅ WebSocket real-time updates
- ✅ Responsive design

Enjoy your traffic management system! 🚦

