const app = require('./src/app');
const dotenv = require('dotenv');
const initWS = require('./src/utils/WS');

dotenv.config();

const PORT = process.env.PORT || 3333;

const server = app.listen(PORT, (err) => {
  if (!err)
    console.log('App listening on port', PORT);
});

initWS(server);
