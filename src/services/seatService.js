// src/services/seatService.js

const config = {
  totalSeats: 20,
  holdExpirySeconds: 60,
  maxActiveHoldsPerUser: 2,
  maxHoldsPerHour: 5,
  maxExtensions: 2
};

let seats = Array(config.totalSeats).fill(null); // seat state
let holds = {}; // { code: { email, seat, expiry, extensions, confirmed } }
let waitlist = [];
let eventLog = [];
let userHoldHistory = {}; // track holds per hour

// Utility: generate hold code
function generateHoldCode() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // excludes 0,O,1,I,L
  let code;
  do {
    code = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  } while (holds[code]); // ensure uniqueness
  return code;
}

// Utility: log events
function logEvent(type, details) {
  eventLog.push({ type, ...details, timestamp: new Date() });
}

// Utility: expire holds
function expireHolds() {
  const now = Date.now();
  for (const code in holds) {
    const hold = holds[code];
    if (!hold.confirmed && hold.expiry <= now) {
      seats[hold.seat - 1] = null;
      logEvent('EXPIRED', { seat: hold.seat, email: hold.email, code });
      delete holds[code];
      promoteWaitlist();
    }
  }
}

// Place hold
function placeHold(email, seatNumber) {
  expireHolds();

  // Rule: seat must be available
  if (seats[seatNumber - 1]) throw new Error('Seat already held or confirmed');

  // Rule: max active holds per user
  const activeHolds = Object.values(holds).filter(h => h.email === email && !h.confirmed);
  if (activeHolds.length >= config.maxActiveHoldsPerUser) throw new Error('User has too many active holds');

  // Rule: max holds per hour
  const now = Date.now();
  userHoldHistory[email] = (userHoldHistory[email] || []).filter(ts => now - ts < 3600000);
  if (userHoldHistory[email].length >= config.maxHoldsPerHour) throw new Error('User exceeded holds per hour');
  userHoldHistory[email].push(now);

  const code = generateHoldCode();
  holds[code] = { email, seat: seatNumber, expiry: now + config.holdExpirySeconds * 1000, extensions: 0, confirmed: false };
  seats[seatNumber - 1] = code;
  logEvent('HOLD_PLACED', { seat: seatNumber, email, code });
  return { holdCode: code, seat: seatNumber, expiry: holds[code].expiry };
}

// Extend hold
function extendHold(email, code) {
  expireHolds();
  const hold = holds[code];
  if (!hold) throw new Error('Hold not found');
  if (hold.email !== email) throw new Error('Email mismatch');
  if (hold.confirmed) throw new Error('Cannot extend confirmed hold');
  if (hold.extensions >= config.maxExtensions) throw new Error('Max extensions reached');

  hold.expiry = Date.now() + config.holdExpirySeconds * 1000;
  hold.extensions++;
  logEvent('HOLD_EXTENDED', { seat: hold.seat, email, code });
  return { extended: true, newExpiry: hold.expiry };
}

// Confirm hold
function confirmHold(email, code) {
  expireHolds();
  const hold = holds[code];
  if (!hold) throw new Error('Hold not found');
  if (hold.email !== email) throw new Error('Email mismatch');
  if (hold.confirmed) return { confirmed: true, seat: hold.seat }; // idempotent

  hold.confirmed = true;
  logEvent('CONFIRMED', { seat: hold.seat, email, code });
  return { confirmed: true, seat: hold.seat };
}

// Release hold
function releaseHold(email, code) {
  expireHolds();
  const hold = holds[code];
  if (!hold) throw new Error('Hold not found');
  if (hold.email !== email) throw new Error('Email mismatch');

  seats[hold.seat - 1] = null;
  logEvent('RELEASED', { seat: hold.seat, email, code });
  delete holds[code];
  promoteWaitlist();
  return { released: true, seat: hold.seat };
}

// Join waitlist
function joinWaitlist(email) {
  expireHolds();
  if (waitlist.includes(email)) throw new Error('Already on waitlist');
  if (Object.values(holds).some(h => h.email === email)) throw new Error('User already has a hold or confirmed seat');

  waitlist.push(email);
  logEvent('WAITLIST_JOINED', { email });
  return { waitlistPosition: waitlist.length };
}

// Promote waitlist
function promoteWaitlist() {
  expireHolds();
  if (waitlist.length === 0) return;

  const freeSeat = seats.findIndex(s => !s);
  if (freeSeat === -1) return;

  const email = waitlist.shift();
  const code = generateHoldCode();
  holds[code] = { email, seat: freeSeat + 1, expiry: Date.now() + config.holdExpirySeconds * 1000, extensions: 0, confirmed: false };
  seats[freeSeat] = code;
  logEvent('WAITLIST_PROMOTED', { seat: freeSeat + 1, email, code });
}

// Seat map
function getSeatMap() {
  expireHolds();
  return seats.map((code, index) => {
    if (!code) return { seat: index + 1, status: 'available' };
    const hold = holds[code];
    return { seat: index + 1, status: hold.confirmed ? 'confirmed' : 'held', email: hold.email };
  });
}

// Event log
function getEventLog(seat) {
  return eventLog.filter(e => !seat || e.seat === Number(seat));
}

module.exports = {
  config,
  placeHold,
  extendHold,
  confirmHold,
  releaseHold,
  joinWaitlist,
  getSeatMap,
  getEventLog
};
