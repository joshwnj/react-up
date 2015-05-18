'use strict';

const ws = require('ws');

function send (c, data) {
  try {
    const payload = typeof data === 'string' ? data : JSON.stringify(data);
    c.send(payload, function (err) {
      if (err) { console.error('websocket error', err); }
    });
  }
  catch (err) {
    console.error('websocket error', err);
  }
}

module.exports = function setup (httpServer, changeEmitter, jsEmitter) {
  const WebSocketServer = ws.Server;
  const wss = new WebSocketServer({ server: httpServer });

  // whenever a new js bundle has been built, broadcast to all clients
  jsEmitter.on('bytes', function () {
    wss.clients.forEach(function (client) {
      send(client, 'update');
    });
  });

  wss.on('connection', function (c) {
    const sendObjToClient = send.bind(null, c);

    changeEmitter.bufferedChanges.forEach(sendObjToClient);
    changeEmitter.on('change', sendObjToClient);

    c.on('close', function () {
      changeEmitter.removeListener('change', sendObjToClient);
    });
  });
};
