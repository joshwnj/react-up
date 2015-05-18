'use strict';

const babelify = require('babelify');
const browserify = require('browserify');
const concat = require('concat-stream');
const h = require('hyperscript');
const http = require('http');
const path = require('path');

const jsPath = 'dist/main.js';
const jsElem = h('script', { src: jsPath });
const tpl = h('html', [
  h('head', {}, [
    h('meta', { charset: 'utf-8' }),
    h('title', 'loading...'),
    h('meta', { name: 'viewport', content: 'width=device-width' })
  ]),
  h('body', {}, [
    h('#container'),
    jsElem
  ])
]);

module.exports = function (filename) {
  const b = browserify({ debug: true });
  b.transform(babelify);

  b.require(path.join(__dirname, '..', 'node_modules', 'react', 'react.js'), { expose: 'react' });
  b.add(path.join(__dirname, 'wrapper.js'));
  b.require(filename, { expose: 'local/component' });

  let cachedJs = null;
  function getCachedJs (cb) {
    cb = cb || function () {};
    if (cachedJs) { return cb(null, cachedJs); }
    b.bundle().pipe(concat(function (js) {
      cachedJs = js;
      return cb(null, cachedJs);
    }));
  }

  // warm the cache
  getCachedJs();

  const httpServer = http.createServer(function (req, res) {
    if (req.url === '/') {
      return res.end('<!doctype html>\n' + tpl.outerHTML);
    }

    if (req.url.indexOf('/' + jsPath) === 0) {
      getCachedJs(function (err, js) {
        if (err) { throw err; }

        res.writeHead(200, {
          'Content-Type': 'application/javascript',
          'Content-Length': js.length
        });
        res.end(js);
      });
      return;
    }

    res.writeHead(404);
    res.end('not found');
  });

  return httpServer;
};
