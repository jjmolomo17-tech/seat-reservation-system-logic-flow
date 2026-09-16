const seatService = require('../services/seatService');

// Seat map
exports.getSeatMap = (req, res) => {
  res.json(seatService.getSeatMap());
};

// Place hold
exports.placeHold = (req, res) => {
  try {
    const { email, seatNumber } = req.body;
    const result = seatService.placeHold(email, seatNumber);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Extend hold
exports.extendHold = (req, res) => {
  try {
    const { email, holdCode } = req.body;
    const result = seatService.extendHold(email, holdCode);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Confirm hold
exports.confirmHold = (req, res) => {
  try {
    const { email, holdCode } = req.body;
    const result = seatService.confirmHold(email, holdCode);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Release seat
exports.releaseHold = (req, res) => {
  try {
    const { email, holdCode } = req.body;
    const result = seatService.releaseHold(email, holdCode);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Join waitlist
exports.joinWaitlist = (req, res) => {
  try {
    const { email } = req.body;
    const result = seatService.joinWaitlist(email);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Event log
exports.getEventLog = (req, res) => {
  const { seat } = req.query;
  res.json(seatService.getEventLog(seat));
};
