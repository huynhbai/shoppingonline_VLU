const mongoose = require('mongoose');

// Schemas
const AdminSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
  },
  { versionKey: false }
);

const CategorySchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
  },
  { versionKey: false }
);

const CustomerSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
    name: String,
    phone: String,
    email: String,
    active: Number,
    token: String,
  },
  { versionKey: false }
);

const ProductSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    image: String,
    cdate: Number,
    category: CategorySchema,
  },
  { versionKey: false }
);

const ItemSchema = mongoose.Schema(
  {
    product: ProductSchema,
    quantity: Number,
  },
  {
    versionKey: false,
    _id: false,
  }
);

const OrderSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    cdate: Number,
    total: Number,
    status: String,
    customer: CustomerSchema,
    items: [ItemSchema],
  },
  { versionKey: false }
);

// --- PHẦN SỬA ĐỔI QUAN TRỌNG Ở ĐÂY ---
// Thêm tham số thứ 3 để chỉ định chính xác tên collection trong Compass của bạn
const Admin = mongoose.model('Admin', AdminSchema, 'admins'); // Khớp với folder 'admins'
const Category = mongoose.model('Category', CategorySchema, 'categories'); // Khớp với folder 'categories'
const Customer = mongoose.model('Customer', CustomerSchema, 'customers'); // Khớp với folder 'customers'
const Product = mongoose.model('Product', ProductSchema, 'products'); // Khớp với folder 'products'
const Order = mongoose.model('Order', OrderSchema, 'orders'); // Khớp với folder 'orders'

module.exports = {
  Admin,
  Category,
  Customer,
  Product,
  Order,
};
