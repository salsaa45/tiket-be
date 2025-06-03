const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/users/login', authController.loginUsers);
router.post('/admin/register', authController.registerAdmin);
router.post('/admin/login', authController.loginAdmin);

module.exports = router;
