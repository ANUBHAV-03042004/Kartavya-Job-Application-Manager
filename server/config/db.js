const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('POSTGRES_URI:', process.env.POSTGRES_URI);

const sequelize = new Sequelize({
  dialect: process.env.POSTGRES_DIALECT,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DATABASE,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true,
      ca: process.env.POSTGRES_CA_PEM,
    },
  },
  logging: false,
});

module.exports = sequelize;