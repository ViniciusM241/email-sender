const Joi = require('joi');

const messages = require('./messages');

const schema = Joi.object().keys({
  to: Joi.string().email().required().messages(messages),
  template: Joi.string().required().messages(messages),
  subject: Joi.string().required().messages(messages),
  ip: Joi.string().optional().messages(messages),
  params: Joi.object().optional().messages(messages),
  cc: Joi.array().items(Joi.string().email()).optional().messages(messages),
  cco: Joi.array().items(Joi.string().email()).optional().messages(messages),
});

module.exports = schema;
