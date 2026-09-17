const request = require('supertest');
const app = require('../index'); // make sure your Express app is exported from index.js

describe('Seat Reservation API', () => {
  //
  // --- SUCCESS CASES ---
  //
  test('GET /api/seats/map returns seat map', async () => {
    const res = await request(app).get('/api/seats/map');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/seats/hold succeeds with valid email and seat', async () => {
    const res = await request(app)
      .post('/api/seats/hold')
      .send({ email: 'joy@example.com', seatNumber: 1 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('holdCode');
  });

  test('POST /api/seats/confirm succeeds with valid email and holdCode', async () => {
    const holdRes = await request(app)
      .post('/api/seats/hold')
      .send({ email: 'joy@example.com', seatNumber: 2 });
    const holdCode = holdRes.body.holdCode;

    const res = await request(app)
      .post('/api/seats/confirm')
      .send({ email: 'joy@example.com', holdCode });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('confirmed', true);
  });

  test('POST /api/seats/release succeeds with valid email and holdCode', async () => {
    const holdRes = await request(app)
      .post('/api/seats/hold')
      .send({ email: 'joy@example.com', seatNumber: 3 });
    const holdCode = holdRes.body.holdCode;

    const res = await request(app)
      .post('/api/seats/release')
      .send({ email: 'joy@example.com', holdCode });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('released', true);
  });

  test('POST /api/seats/extend succeeds with valid email and holdCode', async () => {
    const holdRes = await request(app)
      .post('/api/seats/hold')
      .send({ email: 'joy@example.com', seatNumber: 4 });
    const holdCode = holdRes.body.holdCode;

    const res = await request(app)
      .post('/api/seats/extend')
      .send({ email: 'joy@example.com', holdCode });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('extended', true);
  });

  test('POST /api/seats/waitlist succeeds with valid email', async () => {
    const res = await request(app)
      .post('/api/seats/waitlist')
      .send({ email: 'joy@example.com' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('waitlistPosition');
  });

  test('GET /api/seats/event-log returns event log', async () => {
    const res = await request(app).get('/api/seats/event-log');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  //
  // --- FAILURE CASES ---
  //
  test('POST /api/seats/hold fails without email', async () => {
    const res = await request(app)
      .post('/api/seats/hold')
      .send({ seatNumber: 1 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Email is required');
  });

  test('POST /api/seats/hold fails with invalid seat number', async () => {
    const res = await request(app)
      .post('/api/seats/hold')
      .send({ email: 'joy@example.com', seatNumber: 999 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid seat number');
  });

  test('POST /api/seats/confirm fails without holdCode', async () => {
    const res = await request(app)
      .post('/api/seats/confirm')
      .send({ email: 'joy@example.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Hold code is required');
  });

  test('POST /api/seats/release fails without email', async () => {
    const res = await request(app)
      .post('/api/seats/release')
      .send({ holdCode: 'ABC123' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Email is required');
  });

  test('POST /api/seats/extend fails without holdCode', async () => {
    const res = await request(app)
      .post('/api/seats/extend')
      .send({ email: 'joy@example.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Hold code is required');
  });

  test('POST /api/seats/waitlist fails without email', async () => {
    const res = await request(app)
      .post('/api/seats/waitlist')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Email is required');
  });
});
