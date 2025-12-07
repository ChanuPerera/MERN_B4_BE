const express = require('express');
const router = express.Router();
const controller = require('../../controllers/user/customer.controller');


router.post('/create', controller.createCustomer);


module.exports = router;

