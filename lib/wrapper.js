'use strict';

const React = require('react');
const widget = require('widget');
const host = location.origin.replace(/^http/, 'ws');
const ws = new WebSocket(host);

const container = document.getElementById('container');

function setProps (props) {
  React.render(React.createElement(widget, props), container);
}

ws.addEventListener('message', function (event) {
  let data;
  try {
    data = JSON.parse(event.data);
  }
  catch (e) {
    console.error('invalid json', event);
    return;
  }

  setProps(data);
});

ws.addEventListener('close', function () {
  console.error('Lost ws connection');
});

setProps({});
window.setProps = setProps;

console.log('ready');
