const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 5000;

// Set higher header limits BEFORE creating the server
const server = http.createServer({
  maxHeaderSize: 32 * 1024 // 32KB headers
}, app);

// Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Increase header size limit to prevent 431 errors
app.use((req, res, next) => {
  res.setHeader('Connection', 'keep-alive');
  next();
});

// MongoDB Connection
require('./utils/MongooseUtil');

// APIs
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});
app.use('/api/admin', require('./api/admin.js'));
app.use('/api/customer', require('./api/customer.js'));

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

