const { DataTypes } = require('sequelize');
const sequelize     = require('../config/db');
const User          = require('./User');

const JobApplication = sequelize.define('JobApplication', {
  id:              { type: DataTypes.STRING, allowNull: false, primaryKey: true },
  userId:          { type: DataTypes.UUID,   allowNull: true },
  companyName:     { type: DataTypes.STRING, allowNull: false },
  jobTitle:        { type: DataTypes.STRING, allowNull: false },
  applicationDate: { type: DataTypes.DATE,   allowNull: false },
  status: {
    type:      DataTypes.ENUM('Applied', 'Interview', 'Offer', 'Rejected'),
    allowNull: false,
  },
  jobLink: { type: DataTypes.STRING },
  notes:   { type: DataTypes.TEXT   },

  createdAt: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
}, {
  tableName:  'job_applications',
  timestamps: false,  
  hooks: {
    // Set createdAt on first insert
    beforeCreate(instance) {
      const now = new Date();
      if (!instance.createdAt) instance.createdAt = now;
      instance.updatedAt = now;
    },
    // Bump updatedAt on every save/update
    beforeUpdate(instance) {
      instance.updatedAt = new Date();
    },
    beforeBulkUpdate(options) {
      if (!options.fields) options.fields = [];
      if (!options.fields.includes('updatedAt')) options.fields.push('updatedAt');
      if (!options.attributes) options.attributes = {};
      options.attributes.updatedAt = new Date();
    },
  },
});

User.hasMany(JobApplication, { foreignKey: 'userId', onDelete: 'CASCADE' });
JobApplication.belongsTo(User, { foreignKey: 'userId' });

module.exports = JobApplication;