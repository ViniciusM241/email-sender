const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const verifyToken = require('./middlewares/verifyToken');
const routes = require('./routes');
const Tasks = require('./utils/Tasks');

const app = express();
const tasks = new Tasks();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(verifyToken);

app.use('/servicos/disparador-emails', routes);

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Invalid route' });
});

tasks.init();

module.exports = app;
