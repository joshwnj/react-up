'use strict';

const path = require('path');

const port = process.env.PORT || 8000;
const widgetFilename = path.resolve(process.argv[2]);

const ndjson = require('ndjson');
const changeEmitter = require('./lib/change-emitter')();
process.stdin.pipe(ndjson.parse())
  .on('data', changeEmitter.emitChange.bind(changeEmitter));

const httpServer = require('./lib/http-server')(widgetFilename);
require('./lib/setup-socket')(httpServer, changeEmitter);

httpServer.listen(port);
console.log('Ready on :%d', port);
