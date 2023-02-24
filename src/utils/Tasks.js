const Mail = require('./Mail');
const schedule = require('node-schedule');
const emailStatusEnum = require('./emailStatusEnum');
const Log = require('../utils/Log');

class Tasks {
  constructor() {
    this.mail = new Mail();
    this.log = new Log();
  }

  init() {
    schedule.scheduleJob('* * * * *', async () => {
      this.log.write('PENDING start: ' + new Date());

      const count = await this.mail.sendTaskEmails(emailStatusEnum.PENDING.id);

      this.log.write('PENDING end: ' + new Date() + ' - count: ' + count);
    });

    schedule.scheduleJob('*/30 * * * *', async () => {
      this.log.write('FAILED start: ' + new Date());

      const count = await this.mail.sendTaskEmails(emailStatusEnum.FINISHED.id);

      this.log.write('FAILED end: ' + new Date() + ' - count: ' + count);
    });
  }
}

module.exports = Tasks;
