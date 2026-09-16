const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');

// Seat map
router.get('/map', seatController.getSeatMap);

// Place hold
router.post('/hold', seatController.placeHold);

// Extend hold
router.post('/extend', seatController.extendHold);

// Confirm hold
router.post('/confirm', seatController.confirmHold);

// Release hold
router.post('/release', seatController.releaseHold);

// Join waitlist
router.post('/waitlist', seatController.joinWaitlist);

// Event log
router.get('/event-log', seatController.getEventLog);

module.exports = router;
