'use strict';

var h = require('hyperscript');
var http = require('http');

var coreJsPath = 'core.js';
var coreJsElem = h('script', { src: coreJsPath });

var jsPath = 'component.js';
var jsElem = h('script', { src: jsPath });

var cssPath = 'component.css';
var cssElem = h('link', {
  href: cssPath,
  type: 'text/css',
  rel: 'stylesheet'
});

var tpl = h('html', [
  h('head', {}, [
    h('meta', { charset: 'utf-8' }),
    h('title', 'loading...'),
    h('meta', { name: 'viewport', content: 'width=device-width' }),
    cssElem
  ]),
  h('body', {}, [
    h('#container'),
    coreJsElem,
    jsElem
  ])
]);

module.exports = function (getCachedJs, opts) {
  opts = opts || {};

  var httpServer = http.createServer(function (req, res) {
    if (req.url === '/') {
      return res.end('<!doctype html>\n' + tpl.outerHTML);
    }

    if (req.url.indexOf('/' + cssPath) === 0) {
      res.writeHead(200, {
        'Content-Type': 'text/css'
      });

      if (opts.css) {
        require('fs').createReadStream(opts.css).pipe(res);
      }
      else {
        res.end('');
      }
      return;
    }

    if (req.url.indexOf('/' + coreJsPath) === 0) {
      res.writeHead(200, {
        'Content-Type': 'application/javascript'
      });

      // Note: this assumes `npm run build` has been run:
      require('fs').createReadStream(__dirname + '/../core.build.js').pipe(res);
      return;
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
