'use strict';

const ndjson = require('ndjson');
const setupHttp = require('./lib/http-server');
const setupSocket = require('./lib/setup-socket');

module.exports = function (filename, opts, cb) {
  const changeEmitter = require('./lib/change-emitter')();

  if (opts.inStream) {
    opts.inStream.pipe(ndjson.parse())
      .on('data', changeEmitter.emitChange.bind(changeEmitter))
      .on('error', cb);
  }

  const httpServer = setupHttp(filename);
  setupSocket(httpServer, changeEmitter);

  httpServer.listen(opts.port);
  cb();
}
