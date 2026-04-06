const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Create server with larger header size
const server = http.createServer({
  maxHeaderSize: 32 * 1024 // 32KB
}, app);

// Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Fix 431 headers issue
app.use((req, res, next) => {
  res.setHeader('Connection', 'keep-alive');
  next();
});

// MongoDB
require('./utils/MongooseUtil');

// ================= API =================
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.use('/api/admin', require('./api/admin.js'));
app.use('/api/customer', require('./api/customer.js'));

// ================= STATIC FILES =================

// ADMIN (ưu tiên đặt trước)
app.use('/admin', express.static(path.resolve(__dirname, '../client-admin/build')));

app.get('/admin/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client-admin/build', 'index.html'));
});

// CUSTOMER
app.use('/', express.static(path.resolve(__dirname, '../client-customer/build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client-customer/build', 'index.html'));
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// START SERVER
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});