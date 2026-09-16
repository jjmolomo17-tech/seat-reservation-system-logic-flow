// src/index.js
const express = require('express');
const cors = require('cors');

const app = express();   // <-- this line was missing
app.use(cors());
app.use(express.json());

// Import routes
const seatRoutes = require('./routes/seats');
app.use('/api/seats', seatRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
