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



// server/index.js  (entry point)
const express   = require('express');
const cors      = require('cors');
const dotenv    = require('dotenv');
const passport  = require('passport');   // ← import AFTER config/passport is required below
const sequelize = require('./config/db');

dotenv.config();

// Models — must be imported before sync
const User           = require('./models/User');
const JobApplication = require('./models/JobApplication');

// Passport strategies (side-effectful require — registers strategies)
require('./config/Passport');

const app = express();

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://kartavya212.netlify.app',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
}));

app.use(express.json());

// Passport (no session needed — we use JWT after OAuth callback)
app.use(passport.initialize());

// Routes
app.use('/api/auth',             require('./routes/Auth'));
app.use('/api/job-applications', require('./routes/JobApplication'));

// DB startup
async function startDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');

    // Add missing columns safely (for existing Render deployments)
    const qi        = sequelize.getQueryInterface();
    const tableDesc = await qi.describeTable('job_applications').catch(() => null);
    if (tableDesc && !tableDesc.userId) {
      console.log('🔧 Adding userId column to job_applications…');
      await qi.addColumn('job_applications', 'userId', {
        type: require('sequelize').DataTypes.UUID,
        allowNull: true,
      });
    }

    // alter:true adds new columns (securityQuestion, securityAnswer, oauthProvider, oauthId)
    await sequelize.sync({ alter: true });
    console.log('✅ DB synced');
  } catch (err) {
    console.error('❌ DB error:', err.message);
  }
}

startDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Kartavya server on port ${PORT}`));