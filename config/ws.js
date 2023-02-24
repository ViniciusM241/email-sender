const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.WS_PORT,
};
