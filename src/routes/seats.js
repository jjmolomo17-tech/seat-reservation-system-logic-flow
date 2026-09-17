const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');

// Seat map
router.get('/map', (req, res) => {
  try {
    const result = seatController.getSeatMap(req, res);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load seat map' });
  }
});

// Place hold
router.post('/hold', (req, res) => {
  const { email, seatNumber } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  if (!seatNumber || seatNumber < 1 || seatNumber > seatController.config.totalSeats) {
    return res.status(400).json({ error: 'Invalid seat number' });
  }
  try {
    const result = seatController.placeHold(req, res);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Confirm hold
router.post('/confirm', (req, res) => {
  const { email, holdCode } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  if (!holdCode) return res.status(400).json({ error: 'Hold code is required' });
  try {
    const result = seatController.confirmHold(req, res);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Release hold
router.post('/release', (req, res) => {
  const { email, holdCode } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  if (!holdCode) return res.status(400).json({ error: 'Hold code is required' });
  try {
    const result = seatController.releaseHold(req, res);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Extend hold
router.post('/extend', (req, res) => {
  const { email, holdCode } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  if (!holdCode) return res.status(400).json({ error: 'Hold code is required' });
  try {
    const result = seatController.extendHold(req, res);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Join waitlist
router.post('/waitlist', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  try {
    const result = seatController.joinWaitlist(req, res);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Event log
router.get('/event-log', (req, res) => {
  try {
    const result = seatController.getEventLog(req, res);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load event log' });
  }
});

module.exports = router;
