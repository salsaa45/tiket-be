const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token tidak ditemukan' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token tidak ditemukan' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token tidak valid' });
    req.user = decoded;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Akses admin dibutuhkan' });
  next();
};

module.exports = { verifyToken, isAdmin };
