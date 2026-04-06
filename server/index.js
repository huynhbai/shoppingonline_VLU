const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Create server
const server = http.createServer({
  maxHeaderSize: 32 * 1024
}, app);

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Fix 431 headers issue
app.use((req, res, next) => {
  res.setHeader('Connection', 'keep-alive');
  next();
});

// ===== DATABASE =====
require('./utils/MongooseUtil');

// ===== API =====
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.use('/api/admin', require('./api/admin.js'));
app.use('/api/customer', require('./api/customer.js'));

// ===== STATIC FILES =====

// ADMIN (đặt trước)
const adminPath = path.resolve(__dirname, '../client-admin/build');

app.use('/admin', express.static(adminPath));

// fallback cho React admin (KHÔNG dùng *)
app.use('/admin', (req, res) => {
  res.sendFile(path.join(adminPath, 'index.html'));
});

// CUSTOMER
const customerPath = path.resolve(__dirname, '../client-customer/build');

app.use(express.static(customerPath));

// fallback cho React customer
app.get('*', (req, res) => {
  res.sendFile(path.join(customerPath, 'index.html'));
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// ===== START SERVER =====
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});