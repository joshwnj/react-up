'use strict';

const React = require('react');
const MsgBody = require('./msg-body');

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
        <MsgBody text={this.props.text} />
      </div>
    );
  }
});
