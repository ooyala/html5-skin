var ControlButton = require('./controlButton');
var holdOnClick = require('./higher-order/holdOnClick');

var HoldControlButton = holdOnClick(ControlButton);

module.exports = HoldControlButton;
