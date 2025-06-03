const pool = require('../db');

const UserModel = {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  async createUser(user) {
    const { username, email, password, role } = user;
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, password, role || 'user']
    );
    return { id: result.insertId, username, email, role: role || 'user' };
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },
};

module.exports = UserModel;
