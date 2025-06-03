// src/models/EventModel.js
const db = require('../db');

// Ambil semua event
async function getAllEvents() {
  const [rows] = await db.query('SELECT * FROM events');
  return rows;
}

// Ambil event berdasarkan ID
async function getEventById(id) {
  const [rows] = await db.query('SELECT * FROM events WHERE id = ?', [id]);
  return rows[0];
}

// Buat event baru
async function createEvent({ name, date }) {
  const [result] = await db.query(
    'INSERT INTO events (name, date, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
    [name, date]
  );
  return { id: result.insertId, name, date };
}

// Update event
async function updateEvent(id, { name, date }) {
  await db.query(
    'UPDATE events SET name = ?, date = ?, updated_at = NOW() WHERE id = ?',
    [name, date, id]
  );
  const updatedEvent = await getEventById(id);
  return updatedEvent;
}

// Hapus event
async function deleteEvent(id) {
  const [result] = await db.query('DELETE FROM events WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
