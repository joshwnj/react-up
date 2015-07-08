'use strict';

var babelify = require('babelify');
var browserify = require('browserify');
var concat = require('concat-stream');
var path = require('path');
var watchify = require('watchify');

module.exports = function (filename, opts) {
  var b = browserify(watchify.args);
  var w = watchify(b);

  if (opts.setupBrowserify) {
    opts.setupBrowserify(w);
  } else {
    w.transform(babelify);
  }

  // external deps come from the core bundle, built with `npm run build`
  w.external('react');
  w.external('react-up/core');
  w.add(path.join(__dirname, 'entry.js'));
  w.require(filename, { expose: 'local/component' });

  var _cache = null;

  function buildAndCache (cb) {
    cb = cb || function () {};

    w.bundle(function (err, js) {
      if (err) { return cb(err); }

      _cache = js;
      return cb(null, js);
    });
  }

  function getCachedJs (cb) {
    cb = cb || function () {};

    if (_cache) {
      return cb(null, _cache);
    }
    else {
      return buildAndCache(cb);
    }
  }

  // build and cache new bundles immediately, and others can pick up
  // on the `bytes` event emitted by watchify when it completes a bundle.
  w.on('update', function () {
    buildAndCache();
  });

  // expose watchify emitter
  getCachedJs.on = w.on.bind(w);

  return getCachedJs;
}
