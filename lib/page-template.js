'use strict';

let h = require('hyperscript');

module.exports = function (contentElems) {
  const jsPath = 'dist/main.js';
  const jsElem = h('script', { src: jsPath });

  return h('html', [
    h('head', {}, [
      h('meta', { charset: 'utf-8' }),
      h('title', 'React Widget'),
      h('meta', { name: 'viewport', content: 'width=device-width' })
    ]),
    h('body', {}, [
      h('.content', contentElems || []),
      jsElem
    ])
  ]);
};
