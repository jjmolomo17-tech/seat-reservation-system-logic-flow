const seatService = require('../services/seatService');

exports.getSeatMap = () => seatService.getSeatMap();

exports.placeHold = (req, res) => {
  const { email, seatNumber } = req.body;
  return seatService.placeHold(email, seatNumber);
};

exports.confirmHold = (req, res) => {
  const { email, holdCode } = req.body;
  return seatService.confirmHold(email, holdCode);
};

exports.releaseHold = (req, res) => {
  const { email, holdCode } = req.body;
  return seatService.releaseHold(email, holdCode);
};

exports.extendHold = (req, res) => {
  const { email, holdCode } = req.body;
  return seatService.extendHold(email, holdCode);
};

exports.joinWaitlist = (req, res) => {
  const { email } = req.body;
  return seatService.joinWaitlist(email);
};

exports.getEventLog = (req, res) => {
  const { seat } = req.query;
  return seatService.getEventLog(seat);
};

// Config reference for validation
exports.config = seatService.config;
