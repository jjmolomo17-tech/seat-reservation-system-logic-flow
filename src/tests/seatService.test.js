const seatService = require('../services/seatService');

describe('Seat Reservation Rules', () => {
  beforeEach(() => {
    // Reset state before each test
    seatService.seats = Array(seatService.config.totalSeats).fill(null);
    seatService.holds = {};
    seatService.waitlist = [];
    seatService.eventLog = [];
    seatService.userHoldHistory = {};
  });

  test('Hold code format excludes 0,O,1,I,L', () => {
    const result = seatService.placeHold('joy@example.com', 1);
    expect(result.holdCode).toMatch(/^[A-Z0-9]{6}$/);
    expect(result.holdCode).not.toMatch(/[0O1IL]/);
  });

  test('Hold expires after configured seconds', () => {
    const result = seatService.placeHold('joy@example.com', 1);
    const code = result.holdCode;
    // Force expiry
    seatService.holds[code].expiry = Date.now() - 1000;
    seatService.getSeatMap();
    expect(seatService.seats[0]).toBe(null);
  });

  test('User cannot exceed max active holds', () => {
    seatService.placeHold('joy@example.com', 1);
    seatService.placeHold('joy@example.com', 2);
    expect(() => seatService.placeHold('joy@example.com', 3)).toThrow('User has too many active holds');
  });

  test('Confirm hold is idempotent', () => {
    const result = seatService.placeHold('joy@example.com', 1);
    const code = result.holdCode;
    const firstConfirm = seatService.confirmHold('joy@example.com', code);
    const secondConfirm = seatService.confirmHold('joy@example.com', code);
    expect(firstConfirm).toEqual(secondConfirm);
  });

  test('Waitlist promotion works', () => {
    // Fill all seats
    for (let i = 1; i <= seatService.config.totalSeats; i++) {
      seatService.placeHold(`user${i}@example.com`, i);
    }
    // Join waitlist
    seatService.joinWaitlist('joy@example.com');
    // Release one seat
    const code = Object.keys(seatService.holds)[0];
    seatService.releaseHold(seatService.holds[code].email, code);
    // Joy should be promoted
    const promoted = Object.values(seatService.holds).find(h => h.email === 'joy@example.com');
    expect(promoted).toBeDefined();
  });

  test('User can extend a hold up to maxExtensions', () => {
    const result = seatService.placeHold('joy@example.com', 1);
    const code = result.holdCode;

    // First extension
    const first = seatService.extendHold('joy@example.com', code);
    expect(first.extended).toBe(true);

    // Second extension
    const second = seatService.extendHold('joy@example.com', code);
    expect(second.extended).toBe(true);

    // Third extension should fail
    expect(() => seatService.extendHold('joy@example.com', code)).toThrow('Max extensions reached');
  });

  test('User cannot exceed max holds per hour', () => {
    // Place 5 holds successfully
    for (let i = 1; i <= seatService.config.maxHoldsPerHour; i++) {
      seatService.placeHold('joy@example.com', i);
      // Release immediately to free seat, but still counts toward hourly limit
      const code = Object.keys(seatService.holds)[0];
      seatService.releaseHold('joy@example.com', code);
    }

    // Sixth hold should fail
    expect(() => seatService.placeHold('joy@example.com', 6)).toThrow('User exceeded holds per hour');
  });
});
