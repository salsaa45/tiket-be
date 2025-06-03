// src/controllers/eventController.js
const EventModel = require('../models/EventModel');

exports.getEvents = async (req, res) => {
  try {
    const events = await EventModel.getAllEvents();
    res.json(events);
  } catch (error) {
    console.error('Error getting events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await EventModel.getEventById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    console.error('Error getting event by id:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.createEvent = async (req, res) => {
  try {
    const { name, date } = req.body;
    if (!name || !date) {
      return res.status(400).json({ message: 'Name dan date wajib diisi' });
    }
    const newEvent = await EventModel.createEvent({ name, date });
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error createEvent:', error); // penting!
    res.status(500).json({ message: 'Gagal membuat event', error: error.message });
  }
};




exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { name, date } = req.body;

  if (!name || !date) {
    return res.status(400).json({ message: 'Nama dan tanggal event harus diisi' });
  }

  try {
    const updatedEvent = await EventModel.updateEvent(id, { name, date });
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event tidak ditemukan' });
    }
    res.json({ message: 'Event berhasil diperbarui', event: updatedEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui event' });
  }
};



exports.deleteEvent = async (req, res) => {
  try {
    const deleted = await EventModel.deleteEvent(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
