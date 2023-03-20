const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const mailConfig = require('../../config/mail');
const Email = require('../models/Email');
const emailStatusEnum = require('./emailStatusEnum');

dotenv.config();

class Mail {
  constructor() {
    this.limit = 100;

    this.mail = this._config();
  }

  _config() {
    return nodemailer.createTransport({
      host: mailConfig.host,
      service: mailConfig.service,
      port: mailConfig.port,
      secure: false,
      auth: {
        user: mailConfig.user,
        pass: mailConfig.pass,
      },
    });
  }

  async sendTaskEmails(status) {
    let emails = [];

    if (status === emailStatusEnum.PENDING.id) {
      emails = await this._getPendingEmails();
    } else {
      emails = await this._getFailedEmails();
    }

    Promise.all(
      emails.map(async email => {
        await this._send(email);
      })
    );

    return emails.length;
  }

  async _getPendingEmails() {
    const emails = Email.findAll({
      where: {
        status: emailStatusEnum.PENDING.id,
      },
      limit: this.limit,
    });

    return emails;
  }

  async _getFailedEmails() {
    const emails = Email.findAll({
      where: {
        status: emailStatusEnum.FAILED.id,
        attempts: 1,
      },
      limit: this.limit,
    });

    return emails;
  }

  async _send(email) {
    email.attempts = email.attempts + 1;

    try {
      if (!(
          process.env.ENV !== 'prod' &&
          !process.env.SEND_EMAIL_ONLY_FOR.split(';').includes(email.to)
      )) {
        await this.mail.sendMail({
          to: email.to,
          from: `SYSPROCARD <${email.from}>`,
          html: email.html,
          subject: email.subject,
          cc: email.cc?.split(';'),
          bcc: email.cco?.split(';'),
          attachments: this._handleAttachments(email.attachments),
        });
      }

      email.status = emailStatusEnum.FINISHED.id,

      await email.save();

      return true;
    } catch(err) {
      console.log(err);

      email.status = emailStatusEnum.FAILED.id,

      await email.save();

      return false;
    }
  }

  _handleAttachments(attachments) {
    if (!attachments?.split(";")?.length) return [];

    return attachments.split(";").reduce((acc, cur) => {
      const filename = cur.split("\\").pop();

      return [
        ...acc,
        {
          filename,
          path: cur,
        },
      ];
    }, []);
  }
}

module.exports = Mail;
