const express = require('express');
const router = express.Router();
const controller = require('../../controllers/auth/auth.controller');


router.post('/client/login', controller.loginUser);


module.exports = router;

