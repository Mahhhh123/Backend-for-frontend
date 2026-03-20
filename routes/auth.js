const express = require('express');
// 🌟 1. เพิ่ม getUser เข้ามาในนี้
const { register, login, logout, getMe, getUser } = require('../controllers/auth'); 
const { protect } = require('../middleware/middleware'); 
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.get('/users/:id', protect, getUser); 

module.exports = router;