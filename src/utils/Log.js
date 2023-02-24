const path = require('path');
const fs = require('fs');
const moment = require('moment');

class Log {
  constructor() {
    this.filename = `LOG_${moment().format('DD-MM-yyyy')}.log`;
    this.dir = path.join(__dirname, '..', '..', 'logs', this.filename);
  }

  write(message) {
    if (!fs.existsSync(this.dir)) {
      fs.writeFileSync(this.dir, message);
    } else {
      fs.appendFileSync(this.dir, message);
    }

    fs.appendFileSync(this.dir, '\n');
  }
}

module.exports = Log;
