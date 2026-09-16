const express = require('express');
const cors = require('cors');
const seatService = require('./services/seatService');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const seatRoutes = require('./routes/seats');
app.use('/api/seats', seatRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Seat Reservation System API is running. Use /api/seats/... endpoints.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

// Scheduled expiry loop: runs every 2 seconds
setInterval(() => {
  seatService.getSeatMap(); // internally calls expireHolds()
}, 2000);
