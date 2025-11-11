const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');
const eventRoutes = require('./routes/events');
const scheduler = require('./services/scheduler');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Calendar API Server',
    version: '1.0.0',
    endpoints: {
      events: '/api/events',
      health: '/health'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/events', eventRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize database and start server
async function startServer() {
  try {
    await db.connect();
    
    // Start event scheduler
    scheduler.start();

    app.listen(PORT, () => {
      console.log(`\n=================================`);
      console.log(`Calendar API Server running on port ${PORT}`);
      console.log(`http://localhost:${PORT}`);
      console.log(`=================================\n`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, shutting down gracefully...');
      scheduler.stop();
      await db.close();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('\nSIGINT received, shutting down gracefully...');
      scheduler.stop();
      await db.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
