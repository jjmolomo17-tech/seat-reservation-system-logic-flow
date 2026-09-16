const request = require('supertest');
const express = require('express');
const seatRoutes = require('../routes/seats');
const seatService = require('../services/seatService');

const app = express();
app.use(express.json());
app.use('/api/seats', seatRoutes);

describe('Seat Reservation API', () => {
  beforeEach(() => {
    // Reset state before each test
    seatService.seats = Array(seatService.config.totalSeats).fill(null);
    seatService.holds = {};
    seatService.waitlist = [];
    seatService.eventLog = [];
    seatService.userHoldHistory = {};
  });

  test('GET /api/seats/map returns seat map', async () => {
    const res = await request(app).get('/api/seats/map');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(seatService.config.totalSeats);
  });

  test('POST /api/seats/hold places a hold', async () => {
    const res = await request(app)
      .post('/api/seats/hold')
      .send({ email: 'joy@example.com', seatNumber: 1 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('holdCode');
  });

  test('POST /api/seats/confirm confirms a hold', async () => {
    const hold = seatService.placeHold('joy@example.com', 1);
    const res = await request(app)
      .post('/api/seats/confirm')
      .send({ email: 'joy@example.com', holdCode: hold.holdCode });
    expect(res.statusCode).toBe(200);
    expect(res.body.confirmed).toBe(true);
  });

  test('POST /api/seats/release releases a seat', async () => {
    const hold = seatService.placeHold('joy@example.com', 1);
    const res = await request(app)
      .post('/api/seats/release')
      .send({ email: 'joy@example.com', holdCode: hold.holdCode });
    expect(res.statusCode).toBe(200);
    expect(res.body.released).toBe(true);
  });

  test('POST /api/seats/waitlist joins waitlist', async () => {
    // Fill all seats
    for (let i = 1; i <= seatService.config.totalSeats; i++) {
      seatService.placeHold(`user${i}@example.com`, i);
    }
    const res = await request(app)
      .post('/api/seats/waitlist')
      .send({ email: 'joy@example.com' });
    expect(res.statusCode).toBe(200);
    expect(res.body.waitlistPosition).toBe(1);
  });
});
