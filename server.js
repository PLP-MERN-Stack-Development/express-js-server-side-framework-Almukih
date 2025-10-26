// server.js - Completed Express Products API

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const productsRouter = require('./routes/products');
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');
const { NotFoundError } = require('./errors/errors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(logger);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// Authentication middleware (applies to all /api routes)
app.use('/api', auth);

// Product routes
app.use('/api/products', productsRouter);

// 404 for unmatched routes
app.use((req, res, next) => {
  next(new NotFoundError('Route not found'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      type: err.name || 'Error',
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
