
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token tidak ditemukan' });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Token tidak valid' });
      req.user = user;
      next();
    });
  }
  
  function authorizeAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Akses admin dibutuhkan' });
    }
    next();
  }
  
  module.exports = { authenticateToken, authorizeAdmin };
  