'use strict';

const h = require('hyperscript');
const http = require('http');

const coreJsPath = 'core.js';
const coreJsElem = h('script', { src: coreJsPath });

const jsPath = 'component.js';
const jsElem = h('script', { src: jsPath });

const cssPath = 'component.css';
const cssElem = h('link', {
  href: cssPath,
  type: 'text/css',
  rel: 'stylesheet'
});

const tpl = h('html', [
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

  const httpServer = http.createServer(function (req, res) {
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
