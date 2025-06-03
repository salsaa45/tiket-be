const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticateToken, authorizeAdmin } = require('../middleware/eventAuth');
// const { authenticateToken, authorizeAdmin } = require('../eventAuth');


router.get('/', authenticateToken, authorizeAdmin, eventController.getEvents);
router.post('/', authenticateToken, authorizeAdmin, eventController.createEvent);
router.put('/:id', authenticateToken, authorizeAdmin, eventController.updateEvent);
router.delete('/:id', authenticateToken, authorizeAdmin, eventController.deleteEvent);

module.exports = router;
