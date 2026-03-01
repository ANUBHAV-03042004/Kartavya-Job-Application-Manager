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




const express   = require('express');
const cors      = require('cors');
const dotenv    = require('dotenv');
const sequelize = require('./config/db');

dotenv.config();

// ⚠️  Import models FIRST so Sequelize registers them before sync
const User           = require('./models/User');
const JobApplication = require('./models/JobApplication');

const app = express();

app.use(cors({
  origin: [
    'https://kartavya212.netlify.app',
    'http://localhost:5173',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));
app.use(express.json());

app.use('/api/auth',             require('./routes/Auth'));
app.use('/api/job-applications', require('./routes/JobApplication'));

// Sync with alter:true — adds missing columns (userId) without dropping data
async function startDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');

    // Manually add userId column if it doesn't exist (extra safety for Render)
    const qi = sequelize.getQueryInterface();
    const tableDesc = await qi.describeTable('job_applications').catch(() => null);
    if (tableDesc && !tableDesc.userId) {
      console.log('🔧 Adding missing userId column…');
      await qi.addColumn('job_applications', 'userId', {
        type:      require('sequelize').DataTypes.UUID,
        allowNull: true, // temporarily allow null for existing rows
      });
      console.log('✅ userId column added');
    }

    await sequelize.sync({ alter: true });
    console.log('✅ DB synced');
  } catch (err) {
    console.error('❌ DB error:', err.message);
  }
}

startDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Kartavya server on port ${PORT}`));