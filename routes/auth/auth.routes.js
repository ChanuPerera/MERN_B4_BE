const express = require('express');
const router = express.Router();
const controller = require('../../controllers/auth/auth.controller');
const { verifyToken } = require('../../middleware/authMiddleware');


router.post('/client/login', controller.loginUser);
router.post('/client/logout', controller.logoutUser);
router.get('/client/me', verifyToken, controller.getMe);


module.exports = router;

