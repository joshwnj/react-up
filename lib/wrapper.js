'use strict';

const React = require('react');
const widget = require('widget')(setProps);
const host = location.origin.replace(/^http/, 'ws');
const ws = new WebSocket(host);

const component = widget.createComponent();

let msgCount = 0;
ws.addEventListener('message', function (event) {
  let data;
  try {
    data = JSON.parse(event.data);
  }
  catch (e) {
    console.error('invalid json', event);
    return;
  }

  if (msgCount === 0) {
    widget.receiveInitialState(data);
  }
  else {
    widget.receiveChange(data);
  }

  msgCount += 1;
});

ws.addEventListener('close', function () {
  console.error('Lost ws connection');
});

const container = document.getElementById('container');
function setProps (props) {
  React.render(widget.createComponent(props), container);
}

React.render(widget.createComponent(), container);

console.log('ready');
