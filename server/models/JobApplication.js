const { DataTypes } = require('sequelize');
const sequelize     = require('../config/db');
const User          = require('./User');

const JobApplication = sequelize.define('JobApplication', {
  id:              { type: DataTypes.STRING, allowNull: false, primaryKey: true },
  userId:          { type: DataTypes.UUID,   allowNull: true },  // allowNull:true for existing rows
  companyName:     { type: DataTypes.STRING, allowNull: false },
  jobTitle:        { type: DataTypes.STRING, allowNull: false },
  applicationDate: { type: DataTypes.DATE,   allowNull: false },
  status: {
    type:      DataTypes.ENUM('Applied', 'Interview', 'Offer', 'Rejected'),
    allowNull: false,
  },
  jobLink: { type: DataTypes.STRING },
  notes:   { type: DataTypes.TEXT   },
}, {
  tableName:  'job_applications',
  timestamps: false,
});

User.hasMany(JobApplication, { foreignKey: 'userId', onDelete: 'CASCADE' });
JobApplication.belongsTo(User, { foreignKey: 'userId' });

module.exports = JobApplication;