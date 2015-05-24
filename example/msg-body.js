'use strict';

var React = require('react');

module.exports = React.createClass({
  displayName: 'MsgBody',

  render () {
    return (
      <p>{this.props.text}</p>
    );
  }
});
