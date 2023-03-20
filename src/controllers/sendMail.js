const Handlebars = require("handlebars");
const fs = require('fs');
const path = require('path');
const schema = require('../utils/validations/emailSchema');
const Email = require('../models/Email');
const mailConfig = require('../../config/mail');

async function sendMailHTTP(req, res) {
  const data = req.body;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  data.ip = ip || 'NAO IDENTIFICADO';

  const { status, message, errors } = await sendMail(data);

  return res.status(status).json({ message, errors });
}

async function sendMailWS(messageString) {
  const data = handleParamsString(messageString);
  const { status, message, errors } = await sendMail(data);

  if (status === 400) {
    if (errors) {
      return `ERRO: ${message}: ${errors.join(' ')}`;
    }

    return `ERRO: ${message}`;
  } else {
    return `SUCESSO: ${message}`;
  }
}

async function sendMail(data) {
  const errors = validate(data);

  if (errors) {
    return { status: 400, message: 'Erros de validação', errors };
  }

  const isTemplateValid = verifyTemplate(data.template);

  if (!isTemplateValid) {
    return { status: 400, message: 'O template informado não existe' };
  }

  const template = getTemplate(data.template);
  const html = template(data.params);
  const attachments = handleAttachments(data.params);

  await Email.create({
    html,
    attachments: attachments?.join(";"),
    template: data.template,
    params: JSON.stringify(data.params),
    to: data.to,
    from: mailConfig.from,
    cc: data.cc?.join(';'),
    cco: data.cco?.join(';'),
    subject: `${data.subject}`,
    requester: data.ip,
  });

  return { status: 201, message: 'E-mail criado com sucesso' };
}

function handleAttachments(params) {
  if (!params.attachments) return null;
  if (!params.attachments.length) return null;

  const attachments = params.attachments.map(attachmentsPath => {
    const dir = path.resolve(attachmentsPath);

    if (!fs.existsSync(dir)) return false;
    if (fs.existsSync(dir) && fs.lstatSync(dir).isDirectory()) return false;

    return dir;
  }).filter(Boolean);

  if (!attachments.length) return null;

  return attachments;
}

function handleParamsString(message) {
  const keyValues = message.split(';');
  const data = keyValues.reduce((acc, cur) => {
    const [ key, _value ] = cur.split('=');

    if (!key || !_value) return acc;

    let value = _value.trim();

    if (key === 'params')
      value = handleParams(value);

    if (key === 'cc' || key === 'cco')
      value = value.split(',');


    return {
      ...acc,
      [key.trim()]:  value,
    };
  }, {});

  function handleParams(string) {
    try {
      return JSON.parse(string);
    } catch(err) {
      console.log(err);

      return {};
    }
  }

  return data;
}

function getTemplate(template) {
  const dir = path.resolve(__dirname, '..', 'templates');
  const templateDir = `${dir}/${template}.handlebars`;
  const emailTemplate = fs.readFileSync(templateDir, { encoding: 'utf-8', flag: 'r' });

  return Handlebars.compile(emailTemplate);
}

function verifyTemplate(template) {
  const dir = path.resolve(__dirname, '..', 'templates');
  const templateDir = `${dir}/${template}.handlebars`;

  return fs.existsSync(templateDir);
}

function validate(data) {
  const { error: errors } = schema.validate(data, { abortEarly: false });

  const handledErrors = errors?.details.map(error => {
    return error.message;
  });

  return handledErrors;
}

module.exports = { sendMailHTTP, sendMailWS };
