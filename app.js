const express = require('express');
const app = express();
const db = require('./db');

const UserController = require('./user/userController');
app.use('/users', UserController);

const AuthController = require('./auth/authController');
app.use('/auth', AuthController);

const productController = require('./product/productController');
app.use('/product', productController);

module.exports = app;