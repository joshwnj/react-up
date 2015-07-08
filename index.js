'use strict';

var ndjson = require('ndjson');
var normalizeOpts = require('./lib/normalize-opts');
var setupHttp = require('./lib/http-server');
var setupSocket = require('./lib/setup-socket');
var path = require('path');

module.exports = function (filename, opts, cb) {
  opts = normalizeOpts(opts);

  var changeEmitter = require('./lib/change-emitter')();

  if (opts.inStream) {
    opts.inStream.pipe(ndjson.parse())
      .on('data', changeEmitter.emitChange.bind(changeEmitter))
      .on('error', cb);
  }

  if (typeof opts.setupBrowserify === 'string') {
    opts.setupBrowserify = require(path.join(process.cwd(), opts.setupBrowserify));
  }

  var buildJs = require('./lib/build-js')(filename, opts);
  var buildCss = require('./lib/build-css')(opts.cssPath);

  // warm the cache
  buildJs();

  var httpServer = setupHttp(buildJs, { css: opts.cssPath });
  setupSocket(httpServer, changeEmitter, buildJs, buildCss);

  httpServer.listen(opts.port);

  if (cb) {
    cb();
  }
  else {
    console.log('Ready at http://localhost:%d', opts.port);
  }
};
