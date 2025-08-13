// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');

dotenv.config();
const app = express();

// app.use(cors());
app.use(cors({
  origin: 'https://kartavya212.netlify.app/',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());

// Routes
app.use('/api/job-applications', require('./routes/JobApplication'));

// Sync DB
sequelize.sync().then(() => {
  console.log('✅ Database synced');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
