const seatService = require('../services/seatService');

exports.getSeatMap = (req, res) => {
  res.json(seatService.seats);
};

exports.placeHold = (req, res) => {
  try {
    const { email, seatNumber } = req.body;
    const code = seatService.placeHold(email, seatNumber);
    res.status(201).json({ holdCode: code, seat: seatNumber });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Extend, confirm, release, waitlist, event log follow same pattern
