'use strict';

var EventEmitter = require('events').EventEmitter;

module.exports = function setup () {
  var changeEmitter = new EventEmitter();
  changeEmitter.bufferedChanges = [];
  changeEmitter.emitChange = function (change) {
    this.emit('change', change);
    this.bufferedChanges.push(change);
  };

  return changeEmitter;
};
