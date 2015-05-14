'use strict';

const React = require('react');
module.exports = React.createClass({
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
