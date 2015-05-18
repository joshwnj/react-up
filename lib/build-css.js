'use strict';

const chokidar = require('chokidar');

module.exports = function (cssPath) {
  if (!cssPath) {
    return { on: function () {} };
  }

  const watcher = chokidar.watch(cssPath);

  return {
    on: watcher.on.bind(watcher)
  };
};
