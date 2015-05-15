'use strict';

const React = require('react');
const component = require('local/component');
const host = location.origin.replace(/^http/, 'ws');
const ws = new WebSocket(host);

const container = document.getElementById('container');

function setProps (props) {
  React.render(React.createElement(component, props), container);
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

document.title = component.displayName || 'React Up';

window.setProps = setProps;
window.component = component;
