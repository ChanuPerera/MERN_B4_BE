const express = require('express');
const router = express.Router();
const controller = require('../../controllers/order/order.controller');
const { verifyToken } = require('../../middleware/authMiddleware');


router.post('/order-place', verifyToken, controller.placeOrder);



module.exports = router;

