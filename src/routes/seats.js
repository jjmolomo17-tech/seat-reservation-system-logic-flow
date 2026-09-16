const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');

// Each route must point to a function
router.get('/map', seatController.getSeatMap);
router.post('/hold', seatController.placeHold);
router.post('/extend', seatController.extendHold);
router.post('/confirm', seatController.confirmHold);
router.post('/release', seatController.releaseHold);
router.post('/waitlist', seatController.joinWaitlist);
router.get('/event-log', seatController.getEventLog);

module.exports = router;
