const { DataTypes } = require('sequelize');
const sequelize     = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type:         DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey:   true,
  },
  name:                 { type: DataTypes.STRING,  allowNull: false },
  email:                { type: DataTypes.STRING,  allowNull: false, unique: true },
  password:             { type: DataTypes.STRING,  allowNull: true },   // null for OAuth users
  // ── Password Reset ──────────────────────────────────────────────
  resetPasswordToken:   { type: DataTypes.STRING,  allowNull: true },
  resetPasswordExpires: { type: DataTypes.DATE,    allowNull: true },
  // ── Security Question (for passwordless account recovery) ────────
  securityQuestion:     { type: DataTypes.STRING,  allowNull: true },
  securityAnswer:       { type: DataTypes.STRING,  allowNull: true },   // stored lowercase
  // ── OAuth ────────────────────────────────────────────────────────
  oauthProvider:        { type: DataTypes.STRING,  allowNull: true },   // 'google' | 'github'
  oauthId:              { type: DataTypes.STRING,  allowNull: true },   // provider's user id
}, {
  tableName:  'users',
  timestamps: true,
});

module.exports = User;