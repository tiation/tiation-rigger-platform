const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.get('/api/v1/status', (req, res) => {
  res.json({
    service: 'rigger-platform-api',
    version: '1.0.0',
    status: 'running',
    message: 'Welcome to Rigger Platform API'
  });
});

// Basic workforce endpoints
app.get('/api/v1/workers', (req, res) => {
  res.json({
    workers: [
      {
        id: 1,
        name: 'John Doe',
        role: 'Senior Rigger',
        certification: 'NCCCO Certified',
        status: 'available'
      },
      {
        id: 2,
        name: 'Jane Smith',
        role: 'Safety Officer',
        certification: 'OSHA 30',
        status: 'on-site'
      }
    ]
  });
});

app.get('/api/v1/jobs', (req, res) => {
  res.json({
    jobs: [
      {
        id: 1,
        title: 'Tower Crane Installation',
        location: 'Downtown Construction Site',
        status: 'open',
        urgency: 'high'
      },
      {
        id: 2,
        title: 'Bridge Rigging Project',
        location: 'Highway 101',
        status: 'in-progress',
        urgency: 'medium'
      }
    ]
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Rigger Platform API running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;