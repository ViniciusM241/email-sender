const dotenv = require('dotenv');
dotenv.config()

module.exports = {
  host: process.env.MAIL_HOST,
  service: process.env.MAIL_SERVICE,
  port: process.env.MAIL_PORT,
  user: process.env.MAIL_USER,
  pass: process.env.MAIL_PASS,
  from: process.env.MAIL_FROM,
};
