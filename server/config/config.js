require('dotenv').config();

module.exports = {
  development: {
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DATABASE,
    port: process.env.RDS_PORT,
    host: process.env.RDS_HOST,
    dialect: 'mysql',
    timezone: '+09:00',
  },
};
