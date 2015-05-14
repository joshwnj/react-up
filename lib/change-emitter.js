'use strict';

const EventEmitter = require('events').EventEmitter;

module.exports = function setup () {
  const changeEmitter = new EventEmitter();
  changeEmitter.bufferedChanges = [];
  changeEmitter.emitChange = function (change) {
    this.emit('change', change);
    this.bufferedChanges.push(change);
  };

  return changeEmitter;
};
