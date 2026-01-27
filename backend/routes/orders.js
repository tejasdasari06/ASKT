const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// GET /api/orders - Get all orders
router.get('/', orderController.getAllOrders);

// GET /api/orders/:id - Get single order
router.get('/:id', orderController.getOrderById);

// POST /api/orders - Create order
router.post('/', orderController.createOrder);

// PUT /api/orders/:id - Update order
router.put('/:id', orderController.updateOrder);

module.exports = router;
