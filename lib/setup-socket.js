'use strict';

var ws = require('ws');

function send (c, data) {
  try {
    var payload = typeof data === 'string' ? data : JSON.stringify(data);
    c.send(payload, function (err) {
      if (err) { console.error('websocket error', err); }
    });
  }
  catch (err) {
    console.error('websocket error', err);
  }
}

module.exports = function setup (httpServer, changeEmitter, jsEmitter, cssEmitter) {
  var WebSocketServer = ws.Server;
  var wss = new WebSocketServer({ server: httpServer });

  // whenever a new js bundle has been built, broadcast to all clients
  jsEmitter.on('bytes', function () {
    wss.clients.forEach(function (client) {
      send(client, 'reload-js');
    });
  });

  // whenever new css is ready, broadcast to all clients
  cssEmitter.on('change', function () {
    wss.clients.forEach(function (client) {
      send(client, 'reload-css');
    });
  });

  wss.on('connection', function (c) {
    var sendObjToClient = send.bind(null, c);

    changeEmitter.bufferedChanges.forEach(sendObjToClient);
    changeEmitter.on('change', sendObjToClient);

    c.on('message', function (data) {
      console.log(data);
    });

    c.on('close', function () {
      changeEmitter.removeListener('change', sendObjToClient);
    });
  });
};
