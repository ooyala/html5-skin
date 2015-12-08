var React = require('react');
var Utils = require('../components/utils');

var TruncateTextMixin = {
  truncateText: function(node, text) {
    // CSS doesn't support "truncate N lines" so we need to do DOM width
    // calculations to figure out where to truncate the description
    var descriptionNode = React.findDOMNode(node);
    descriptionNode.innerHTML = Utils.truncateTextToWidth(descriptionNode, text);
  }
};
module.exports = TruncateTextMixin;