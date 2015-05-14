'use strict';

const React = require('react');

const Msg = React.createClass({
  getDefaultProps () {
    return {
      text: 'MSG GOES HERE'
    };
  },

  render () {
    return (
      <p>{this.props.text}</p>
    );
  }
});

module.exports = function (setProps) {
  return {
    createComponent: function (props) {
      return React.createElement(Msg, props);
    },

    receiveInitialState: function (state) {
      setProps(state);
    },

    receiveChange: function (change) {
      console.log('change', change);
      setProps(change);
    }
  };
};
