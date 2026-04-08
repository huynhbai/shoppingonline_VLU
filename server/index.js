const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// --- ĐIỀU CHỈNH 1: Ưu tiên PORT 10000 cho Render ---
const PORT = process.env.PORT || 10000;

// --- Middlewares ---
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  res.setHeader('Connection', 'keep-alive');
  next();
});

// Kết nối MongoDB (Đảm bảo MONGODB_URI đã trỏ về /ShoppingOnline)
require('./utils/MongooseUtil');

// --- APIs ---
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});
app.use('/api/admin', require('./api/admin.js'));
app.use('/api/customer', require('./api/customer.js'));

// --- Serve Static Files cho Admin ---
app.use('/admin', express.static(path.join(__dirname, '..', 'client-admin', 'build')));
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client-admin', 'build', 'index.html'));
});

// --- Serve Static Files cho Customer ---
app.use(express.static(path.join(__dirname, '..', 'client-customer', 'build')));

// Handle React Router cho trang khách
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

// --- ĐIỀU CHỈNH 2: Dùng app.listen trực tiếp để Render dễ nhận diện Port ---
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
