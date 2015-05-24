'use strict';

var React = require('react');
var componentScriptUrl = 'component.js';

var lastProps = {};
function setProps (props) {
  var wrapperInst = module.wrapperInst;
  if (wrapperInst && wrapperInst.isMounted()) {
    wrapperInst.setState(props);
  }
  lastProps = props;
}

function loadScript (src, onLoaded) {
  var numTries = 0;
  tryLoad();

  function tryLoad () {
    var script = document.createElement('script');
    script.setAttribute('src', src + '?t=' + Date.now());
    script.addEventListener('error', function () {
      if (numTries < 30) {
        numTries += 1;
        setTimeout(tryLoad, 300);
      }
    }, true);
    script.addEventListener('load', onLoaded);
    document.getElementsByTagName('head')[0].appendChild(script);
  }
}

function setupComponentWrapper (Component, ws) {
  var elem = document.getElementById('container');
  var Wrapper = React.createClass({
    componentWillMount () {
      module.wrapperInst = this;
      this.component = Component;
    },

    onAction (data) {
      ws.send(JSON.stringify(data));
    },

    render () {
      module.wrapperInst = this;
      var Component = this.component;
      return <Component {...this.state} actionCallback={this.onAction} />
    }
  });

  React.render(React.createElement(Wrapper), elem);
}

function setupWebsocket () {
  var host = location.origin.replace(/^http/, 'ws');
  var ws = new WebSocket(host);

  ws.addEventListener('message', function (event) {
    if (event.data === 'reload-js') {
      loadScript(componentScriptUrl, function () {
        // re-set the same props as last time (so that the component gets re-rendered)
        setProps(lastProps);
      });
      return;
    }

    if (event.data === 'reload-css') {
      document.querySelector('link[rel=stylesheet]').setAttribute('href', 'component.css?t=' + Date.now());
      return;
    }

    var data;
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

  return ws;
}

function setup (Component) {
  // make sure this function is only called once
  setup = function () {};

  var ws = setupWebsocket();
  setupComponentWrapper(Component, ws);

  window.setProps = setProps;
  window.lastProps = lastProps;
}

module.exports = function (Component) {
  var wrapperInst = module.wrapperInst;
  if (wrapperInst) {
    wrapperInst.component = Component;
    window.setProps(window.lastProps);
  } else {
    setup(Component);
  }

  document.title = Component.displayName || 'React Up';
}
