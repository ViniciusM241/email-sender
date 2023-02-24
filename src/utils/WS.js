const Net = require('net');
const server = Net.createServer();

const wsConfig = require('../../config/ws');
const Log = require('./Log');
const { sendMailWS } = require('../controllers/sendMail');

function init() {
  server.listen(wsConfig.port);

  const log = new Log();
  const clients = new Map();

  server.on('connection', (ws) => {
    const id = generateId();
    const color = Math.floor(Math.random() * 360);
    const metadata = { id, color };

    clients.set(ws, metadata);

    log.write(`${new Date()} - WS: connection ID:${id}`);

    ws.on('data', onMessage);
    ws.on('error', (e) => console.log(e));

    function generateId() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    async function onMessage(messageAsBuffer) {
      const message = messageAsBuffer.toString();
      const _message = message.concat(`;ip=${ws.localAddress}`);

      log.write(`${new Date()} - WS: message ID:${id} - MESSAGE: ${message}`);

      try {
        const res = await sendMailWS(_message);

        ws.write(res);
      } catch(err) {
        console.log(err);
      } finally {
        clients.delete(ws);
        ws.destroy();
      }
    }
  });
}

module.exports = init;
