const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
const pool = require('../db');
require('dotenv').config();


function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '1h',
  });
}


// Tambahkan di bawah semua fungsi:

// const generateToken = (payload) => {
//   return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
// };

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Semua field harus diisi' });
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.createUser({ username, email, password: hashedPassword });
    
    res.status(201).json({ message: 'User berhasil didaftarkan', user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Contoh fungsi login admin
const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  // Query admin berdasarkan email
  const [rows] = await pool.query('SELECT * FROM admin WHERE email = ?', [email]);
  const admin = rows[0];
  
  if (!admin) {
    return res.status(404).json({ message: 'Admin tidak ditemukan' });
  }

  // Validasi password (misal bcrypt)
  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) {
    return res.status(401).json({ message: 'Password salah' });
  }
  
  // Kembalikan data dengan role admin
  const token = generateToken({ id: admin.id, role: 'admin' });
  res.json({
    username: admin.username,
    role: 'admin',
    token,
  });
};

// Contoh fungsi login user
const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  const user = rows[0];
  
  if (!user) {
    return res.status(404).json({ message: 'User tidak ditemukan' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: 'Password salah' });
  }

  const token = generateToken({ id: user.id, role: user.role });
  res.json({
    username: user.username,
    role: user.role,
    token,
  });
};


// Admin register dan login menggunakan tabel admin
exports.registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Semua field harus diisi' });
    }

    const [rows] = await pool.query('SELECT * FROM admin WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'Email admin sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO admin (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'Admin berhasil didaftarkan', adminId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUsers = userLogin;
exports.loginAdmin = adminLogin;
// exports.loginAdmin = async (req, res) => {
  //   try {
//     const { email, password } = req.body;
//     if (!email || !password) return res.status(400).json({ message: 'Email dan password harus diisi' });

//     const [rows] = await pool.query('SELECT * FROM admin WHERE email = ?', [email]);
//     const admin = rows[0];
//     if (!admin) return res.status(401).json({ message: 'Admin tidak ditemukan' });

//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) return res.status(401).json({ message: 'Password salah' });

//     const token = jwt.sign({ id: admin.id, username: admin.username, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
//     res.json({ token, username: admin.username, role: 'admin' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
