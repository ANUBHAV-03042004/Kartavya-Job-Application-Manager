// // server.js
// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const sequelize = require('./config/db');

// dotenv.config();
// const app = express();

// // app.use(cors());
// app.use(cors({
//   origin:[
//   'https://kartavya212.netlify.app', // Production
//   'http://localhost:5173'            // Development
// ],
//   methods: ['GET', 'POST', 'PUT', 'DELETE']
// }));
// app.use(express.json());

// // Routes
// app.use('/api/job-applications', require('./routes/JobApplication'));

// // Sync DB
// sequelize.sync().then(() => {
//   console.log('✅ Database synced');
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


const express    = require('express');
const cors       = require('cors');
const dotenv     = require('dotenv');
const sequelize  = require('./config/db');

// Register models & associations before sync
require('./models/User');
require('./models/JobApplication');

dotenv.config();
const app = express();

app.use(cors({
  origin: [
    'https://kartavya212.netlify.app',
    'http://localhost:5173',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));
app.use(express.json());

// Routes
app.use('/api/auth',             require('./routes/Auth'));
app.use('/api/job-applications', require('./routes/JobApplication'));

// alter: true automatically adds missing columns (fixes "userId does not exist")
sequelize.sync({ alter: true })
  .then(() => console.log('✅ DB synced (alter mode)'))
  .catch(err => console.error('❌ DB sync error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));