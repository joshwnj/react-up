'use strict';

var React = require('react');
var Fingdex = require('fingdex');

var DocList = React.createClass({
  getDefaultProps: function () {
    return {
      docs: []
    };
  },

  render: function () {
    var docs = this.props.docs.map(function (item, i) {
      return <li key={item._id}>{item._id} ({item._type})</li>
    });

    return (
      <ul>
        {docs}
      </ul>
    );
  }
});

function getDocList (state) {
  return Object.keys(state.docs).map(function (id) {
    return state.docs[id];
  });
}

module.exports = function (setProps) {
  return {
    createComponent: function (props) {
      return React.createElement(DocList, props);
    },

    receiveInitialState: function (state) {
      this.docIndex = Fingdex.createDocIndex();
      this.docIndex.docs = state.docs;
      this.docIndex._lastCuid = state.lastCuid;

      setProps({ docs: getDocList(state) });
      window.docIndex = this.docIndex;
    },

    receiveChange: function (change) {
      console.log('change', change);

      this.docIndex.through(change);

      var docs = getDocList(this.docIndex.getSnapshot());
      setProps({ docs: docs });
    }
  };
};
