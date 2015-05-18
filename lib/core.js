'use strict';

const React = require('react');
const componentScriptUrl = 'component.js';

let lastProps = {};
function setProps (props) {
  const wrapperInst = module.wrapperInst;
  if (wrapperInst && wrapperInst.isMounted()) {
    wrapperInst.setState(props);
  }
  lastProps = props;
}

function loadScript (src, onLoaded) {
  let numTries = 0;
  tryLoad();

  function tryLoad () {
    const script = document.createElement('script');
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

function setupComponentWrapper (Component) {
  const elem = document.getElementById('container');
  const Wrapper = React.createClass({
    componentWillMount () {
      module.wrapperInst = this;
      this.component = Component;
    },

    render () {
      module.wrapperInst = this;
      const Component = this.component;
      return <Component {...this.state} />
    }
  });

  React.render(React.createElement(Wrapper), elem);
}

function setupWebsocket () {
  const host = location.origin.replace(/^http/, 'ws');
  const ws = new WebSocket(host);

  ws.addEventListener('message', function (event) {
    if (event.data === 'update') {
      loadScript(componentScriptUrl, function () {
        // re-set the same props as last time (so that the component gets re-rendered)
        setProps(lastProps);
      });
      return;
    }

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
}

function setup (Component) {
  // make sure this function is only called once
  setup = function () {};

  setupComponentWrapper(Component);
  setupWebsocket();

  window.setProps = setProps;
  window.lastProps = lastProps;
}

module.exports = function (Component) {
  let wrapperInst = module.wrapperInst;
  if (wrapperInst) {
    wrapperInst.component = Component;
    window.setProps(window.lastProps);
  } else {
    setup(Component);
  }

  document.title = Component.displayName || 'React Up';
}
