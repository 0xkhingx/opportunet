require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/opportunities', require('./routes/opportunities'));
app.use('/api/users', require('./routes/users'));
app.use('/api/applications', require('./routes/applications'));

// Health check — verify server + DB are alive
app.get('/health', async (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    db: dbStatus,
    timestamp: new Date().toISOString(),
    project: 'OpportuNet Agent'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 OpportuNet backend running on port ${PORT}`);
});
