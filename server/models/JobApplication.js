// models/JobApplication.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const JobApplication = sequelize.define('JobApplication', {
  id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
  companyName: { type: DataTypes.STRING, allowNull: false },
  jobTitle: { type: DataTypes.STRING, allowNull: false },
  applicationDate: { type: DataTypes.DATE, allowNull: false },
  status: { 
    type: DataTypes.ENUM('Applied', 'Interview', 'Offer', 'Rejected'), 
    allowNull: false 
  },
  jobLink: { type: DataTypes.STRING },
  notes: { type: DataTypes.TEXT },
}, {
  tableName: 'job_applications',
  timestamps: false
});

module.exports = JobApplication;
