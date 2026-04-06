const express = require('express');
const router = express.Router();

// utils
const JwtUtil = require('../utils/JwtUtil');
const EmailUtil = require('../utils/EmailUtil'); // ✅ thêm

// daos
const AdminDAO = require('../models/AdminDAO');
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const OrderDAO = require('../models/OrderDAO');
const CustomerDAO = require('../models/CustomerDAO');

// ================== LOGIN ==================
router.post('/login', async function (req, res) {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
      const admin = await AdminDAO.selectByUsernameAndPassword(
        username,
        password
      );

      if (admin) {
        const token = JwtUtil.genToken(username, password);

        res.json({
          success: true,
          message: 'Authentication successful',
          token: token,
        });
      } else {
        res.json({
          success: false,
          message: 'Incorrect username or password',
        });
      }
    } else {
      res.json({
        success: false,
        message: 'Please input username and password',
      });
    }
  } catch (error) {
    console.error('Error in /login:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ================== TOKEN ==================
router.get('/token', JwtUtil.checkToken, function (req, res) {
  try {
    const token =
      req.headers['x-access-token'] || req.headers['authorization'];

    res.json({
      success: true,
      message: 'Token is valid',
      token: token,
    });
  } catch (error) {
    console.error('Error in /token:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ================== CATEGORY ==================
router.get('/categories', JwtUtil.checkToken, async function (req, res) {
  try {
    const categories = await CategoryDAO.selectAll();
    res.json(categories);
  } catch (error) {
    console.error('Error in /categories GET:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/categories', JwtUtil.checkToken, async function (req, res) {
  try {
    const name = req.body.name;
    const category = { name: name };
    const result = await CategoryDAO.insert(category);
    res.json(result);
  } catch (error) {
    console.error('Error in /categories POST:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.params.id;
    const name = req.body.name;
    const category = { _id: _id, name: name };
    const result = await CategoryDAO.update(category);
    res.json(result);
  } catch (error) {
    console.error('Error in /categories PUT:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.params.id;
    const result = await CategoryDAO.delete(_id);
    res.json(result);
  } catch (error) {
    console.error('Error in /categories DELETE:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ================== PRODUCT ==================
router.get('/products', JwtUtil.checkToken, async function (req, res) {
  try {
    const noProducts = await ProductDAO.selectByCount();
    const sizePage = 4;
    const noPages = Math.ceil(noProducts / sizePage);

    var curPage = 1;
    if (req.query.page) curPage = parseInt(req.query.page);

    const skip = (curPage - 1) * sizePage;
    const products = await ProductDAO.selectBySkipLimit(skip, sizePage);

    const result = { products: products, noPages: noPages, curPage: curPage };
    res.json(result);
  } catch (error) {
    console.error('Error in /products GET:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/products', JwtUtil.checkToken, async function (req, res) {
  try {
    const name = req.body.name;
    const price = req.body.price;
    const cid = req.body.category;
    const image = req.body.image;
    const now = new Date().getTime();

    const category = await CategoryDAO.selectByID(cid);
    const product = {
      name: name,
      price: price,
      image: image,
      cdate: now,
      category: category,
    };

    const result = await ProductDAO.insert(product);
    res.json(result);
  } catch (error) {
    console.error('Error in /products POST:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/products/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.params.id;
    const name = req.body.name;
    const price = req.body.price;
    const cid = req.body.category;
    const image = req.body.image;
    const now = new Date().getTime();

    const category = await CategoryDAO.selectByID(cid);
    const product = {
      _id: _id,
      name: name,
      price: price,
      image: image,
      cdate: now,
      category: category,
    };

    const result = await ProductDAO.update(product);
    res.json(result);
  } catch (error) {
    console.error('Error in /products PUT:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.params.id;
    const result = await ProductDAO.delete(_id);
    res.json(result);
  } catch (error) {
    console.error('Error in /products DELETE:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ================== CUSTOMER ==================
router.get('/customers', JwtUtil.checkToken, async function (req, res) {
  try {
    const customers = await CustomerDAO.selectAll();
    res.json(customers);
  } catch (error) {
    console.error('Error in /customers GET:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/customers/deactive/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.params.id;
    const token = req.body.token;
    const result = await CustomerDAO.active(_id, token, 0);
    res.json(result);
  } catch (error) {
    console.error('Error in /customers/deactive:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ thêm gửi mail
router.get('/customers/sendmail/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.params.id;
    const cust = await CustomerDAO.selectByID(_id);

    if (cust) {
      const send = await EmailUtil.send(cust.email, cust._id, cust.token);
      if (send) {
        res.json({ success: true, message: 'Please check email' });
      } else {
        res.json({ success: false, message: 'Email failure' });
      }
    } else {
      res.json({ success: false, message: 'Not exists customer' });
    }
  } catch (error) {
    console.error('Error in /customers/sendmail:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ================== ORDER ==================
router.get('/orders', JwtUtil.checkToken, async function (req, res) {
  try {
    const orders = await OrderDAO.selectAll();
    res.json(orders);
  } catch (error) {
    console.error('Error in /orders GET:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
  try {
    const _cid = req.params.cid;
    const orders = await OrderDAO.selectByCustID(_cid);
    res.json(orders);
  } catch (error) {
    console.error('Error in /orders/customer GET:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/orders/status/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.params.id;
    const newStatus = req.body.status;

    const result = await OrderDAO.update(_id, newStatus);
    res.json(result);
  } catch (error) {
    console.error('Error in /orders/status:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;