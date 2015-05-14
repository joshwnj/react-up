'use strict';

const ws = require('ws');

function sendObj (c, obj) {
  try {
    c.send(JSON.stringify(obj));
  }
  catch (e) {
    console.error('Send failed', e);
  }
}

module.exports = function setup (httpServer, changeEmitter) {
  const WebSocketServer = ws.Server;
  const wss = new WebSocketServer({ server: httpServer });
  wss.on('connection', function (c) {
    const sendObjToClient = sendObj.bind(null, c);

    console.log('Connected');
    changeEmitter.bufferedChanges.forEach(sendObjToClient);
    changeEmitter.on('change', sendObjToClient);

    c.on('close', function () {
      changeEmitter.removeListener('change', sendObjToClient);
    });
  });
};
