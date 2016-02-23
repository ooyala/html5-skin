var ReactDOM = require('react-dom');
var Utils = require('../components/utils');

/**
 * Sets innerHTML of DOM node to truncated text
 *
 * @mixin TruncateTextMixin
 * @param {DOMNode} node - Mounted DOM node to find
 * @param {String} text - The string to trim
 */
var TruncateTextMixin = {
  truncateText: function(node, text) {
    // CSS doesn't support "truncate N lines" so we need to do DOM width
    // calculations to figure out where to truncate the description
    var descriptionNode = ReactDOM.findDOMNode(node);
    descriptionNode.innerHTML = Utils.truncateTextToWidth(descriptionNode, text);
  }
};
module.exports = TruncateTextMixin;