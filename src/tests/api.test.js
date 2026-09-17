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
