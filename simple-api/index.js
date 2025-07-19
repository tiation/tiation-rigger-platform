const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Welcome to Rigger Platform API',
    status: 'running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// API endpoints
app.get('/api/workers', (req, res) => {
  res.json({
    workers: [
      {
        id: 1,
        name: 'John Doe',
        role: 'Senior Rigger',
        certification: 'NCCCO Certified',
        status: 'available',
        experience: '8 years'
      },
      {
        id: 2,
        name: 'Jane Smith', 
        role: 'Safety Officer',
        certification: 'OSHA 30',
        status: 'on-site',
        experience: '5 years'
      },
      {
        id: 3,
        name: 'Mike Johnson',
        role: 'Crane Operator',
        certification: 'NCCCO Mobile Crane',
        status: 'available',
        experience: '12 years'
      }
    ],
    total: 3
  });
});

app.get('/api/jobs', (req, res) => {
  res.json({
    jobs: [
      {
        id: 1,
        title: 'Tower Crane Installation',
        location: 'Downtown Construction Site',
        client: 'ABC Construction',
        status: 'open',
        urgency: 'high',
        requiredWorkers: 3,
        startDate: '2024-01-15',
        description: 'Install 150ft tower crane for high-rise project'
      },
      {
        id: 2,
        title: 'Bridge Rigging Project',
        location: 'Highway 101 Bridge',
        client: 'State DOT',
        status: 'in-progress',
        urgency: 'medium',
        requiredWorkers: 5,
        startDate: '2024-01-10',
        description: 'Steel beam installation for bridge reconstruction'
      }
    ],
    total: 2
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    service: 'Rigger Platform API',
    version: '1.0.0',
    status: 'operational',
    features: [
      'Worker management',
      'Job assignment',
      'Safety tracking',
      'Skills certification'
    ],
    deployment: {
      platform: 'Google Cloud Run',
      region: process.env.GOOGLE_CLOUD_REGION || 'us-central1'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /',
      'GET /health', 
      'GET /api/workers',
      'GET /api/jobs',
      'GET /api/status'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Rigger Platform API running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`Health check: http://localhost:${port}/health`);
});

module.exports = app;