const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Cấu hình Server để tránh lỗi 431 khi gửi dữ liệu lớn
const server = http.createServer({
  maxHeaderSize: 32 * 1024 
}, app);

// --- Middlewares ---
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  res.setHeader('Connection', 'keep-alive');
  next();
});

// Kết nối MongoDB
require('./utils/MongooseUtil');

// --- APIs (Quan trọng: Đặt trước phần serve static files) ---
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});
app.use('/api/admin', require('./api/admin.js'));
app.use('/api/customer', require('./api/customer.js'));

// --- Serve Static Files cho Admin ---
// Link: your-url.onrender.com/admin
app.use('/admin', express.static(path.join(__dirname, '..', 'client-admin', 'build')));
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client-admin', 'build', 'index.html'));
});

// --- Serve Static Files cho Customer ---
// Link: your-url.onrender.com/
// Dùng path.join và '..' để lùi ra ngoài thư mục server tìm folder build
app.use(express.static(path.join(__dirname, '..', 'client-customer', 'build')));

// Handle React Router cho trang khách (giúp F5 không bị lỗi 404)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client-customer', 'build', 'index.html'));
});

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
