'use strict';

const babelify = require('babelify');
const browserify = require('browserify');
const concat = require('concat-stream');
const path = require('path');
const watchify = require('watchify');

module.exports = function (filename) {
  const b = browserify(watchify.args);
  const w = watchify(b);
  w.transform(babelify);

  // external deps come from the core bundle, built with `npm run build`
  w.external('react');
  w.external('react-up/core');
  w.add(path.join(__dirname, 'entry.js'));
  w.require(filename, { expose: 'local/component' });

  let _cache = null;

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
