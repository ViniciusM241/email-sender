const dotenv = require('dotenv');
dotenv.config()

module.exports = {
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  logging: process.env.DB_LOGGING === 'true' ? console.log : null,
  define: {
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_general_ci'
  }
};
