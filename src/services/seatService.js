function getSeatMap() {
  return [{ seat: 1, status: 'available' }];
}

function placeHold(email, seatNumber) {
  return { holdCode: 'ABC123', seat: seatNumber, expiry: new Date() };
}

function extendHold(email, holdCode) {
  return { extended: true, newExpiry: new Date() };
}

function confirmHold(email, holdCode) {
  return { confirmed: true, seat: 5 };
}

function releaseHold(email, holdCode) {
  return { released: true, seat: 5 };
}

function joinWaitlist(email) {
  return { waitlistPosition: 1 };
}

function getEventLog(seat) {
  return [{ type: 'HOLD_PLACED', seat: seat || 1, timestamp: new Date() }];
}

module.exports = {
  getSeatMap,
  placeHold,
  extendHold,
  confirmHold,
  releaseHold,
  joinWaitlist,
  getEventLog
};
