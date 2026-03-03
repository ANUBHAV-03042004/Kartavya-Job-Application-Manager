const express   = require('express');
const cors      = require('cors');
const dotenv    = require('dotenv');
const passport  = require('passport');
const { QueryTypes } = require('sequelize');
const sequelize = require('./config/db');

dotenv.config();

require('./models/User');
require('./models/JobApplication');
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
app.use(passport.initialize());

app.use('/api/auth',require('./routes/Auth'));
app.use('/api/job-applications', require('./routes/JobApplication'));

// ── Add missing columns safely before sync ───────────────────────────────────
async function ensureColumns() {
  const qi = sequelize.getQueryInterface();

  // job_applications: add createdAt and updatedAt if missing
  try {
    const cols = await qi.describeTable('job_applications');

    if (!cols.createdAt) {
      console.log('🔧 Adding createdAt to job_applications…');
      await sequelize.query(
        `ALTER TABLE job_applications ADD COLUMN "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`,
        { type: QueryTypes.RAW }
      );
    }
    if (!cols.updatedAt) {
      console.log('🔧 Adding updatedAt to job_applications…');
      await sequelize.query(
        `ALTER TABLE job_applications ADD COLUMN "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`,
        { type: QueryTypes.RAW }
      );
    }

    // users: add oauthProvider, oauthId, securityQuestion, securityAnswer if missing
    const userCols = await qi.describeTable('users').catch(() => null);
    if (userCols) {
      const toAdd = {
        oauthProvider:    'VARCHAR(255)',
        oauthId:          'VARCHAR(255)',
        securityQuestion: 'VARCHAR(255)',
        securityAnswer:   'VARCHAR(255)',
      };
      for (const [col, type] of Object.entries(toAdd)) {
        if (!userCols[col]) {
          console.log(`🔧 Adding ${col} to users…`);
          await sequelize.query(
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS "${col}" ${type}`,
            { type: QueryTypes.RAW }
          );
        }
      }
    }
  } catch (err) {
    console.warn('⚠️  ensureColumns warning (table may not exist yet):', err.message);
  }
}

async function startDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');

    await ensureColumns();

    // sync without alter now — column additions handled above
    await sequelize.sync();
    console.log('✅ DB synced');
  } catch (err) {
    console.error('❌ DB error:', err.message);
  }
}

startDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));