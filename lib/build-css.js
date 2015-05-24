'use strict';

var chokidar = require('chokidar');

module.exports = function (cssPath) {
  if (!cssPath) {
    return { on: function () {} };
  }

  var watcher = chokidar.watch(cssPath);

  return {
    on: watcher.on.bind(watcher)
  };
};
