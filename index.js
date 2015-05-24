'use strict';

var ndjson = require('ndjson');
var setupHttp = require('./lib/http-server');
var setupSocket = require('./lib/setup-socket');

module.exports = function (filename, opts, cb) {
  var changeEmitter = require('./lib/change-emitter')();

  if (opts.inStream) {
    opts.inStream.pipe(ndjson.parse())
      .on('data', changeEmitter.emitChange.bind(changeEmitter))
      .on('error', cb);
  }

  var buildJs = require('./lib/build-js')(filename);
  var buildCss = require('./lib/build-css')(opts.cssPath);

  // warm the cache
  buildJs();

  var httpServer = setupHttp(buildJs, { css: opts.cssPath });
  setupSocket(httpServer, changeEmitter, buildJs, buildCss);

  httpServer.listen(opts.port);
  cb();
};
