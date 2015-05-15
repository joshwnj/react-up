'use strict';

const React = require('react');

module.exports = React.createClass({
  displayName: 'Msg',

  getDefaultProps () {
    return {
      heading: 'Default heading',
      text: '... msg goes here ...'
    };
  },

  render () {
    return (
      <div>
        <h1>{this.props.heading}</h1>
        <p>{this.props.text}</p>
      </div>
    );
  }
});
