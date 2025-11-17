# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm run install-all
```

### Step 2: Create Environment File
Create `server/.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/traffic-management
NODE_ENV=development
```

**Note:** MongoDB is optional. The system works without it!

### Step 3: Start the Application
```bash
npm run dev
```

This will start:
- ✅ Backend server on http://localhost:5000
- ✅ Frontend app on http://localhost:3000

## 🎯 What You'll See

1. **Dashboard** - Real-time traffic statistics
2. **Map** - Interactive map with traffic signals
3. **Signals** - Control traffic signals manually
4. **Analytics** - Charts and graphs of traffic data

## 📋 Features

- ✅ Real-time traffic monitoring
- ✅ Interactive map visualization
- ✅ Signal control panel
- ✅ Analytics dashboard
- ✅ WebSocket real-time updates
- ✅ Responsive design

## 🛠️ Troubleshooting

### Port Already in Use?
Change the port in `server/.env` and update `client/package.json` proxy.

### MongoDB Not Installed?
No problem! The system works without MongoDB using in-memory data.

### Socket.IO Connection Issues?
Make sure the backend server is running on port 5000.

## 📚 Documentation

- `README.md` - Full documentation
- `SETUP.md` - Detailed setup instructions
- `PROJECT_SUMMARY.md` - Project overview

## 🎉 Enjoy Your Traffic Management System!

For more information, see the README.md file.

