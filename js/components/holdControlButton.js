const ControlButton = require('./controlButton');
const holdOnClick = require('./higher-order/holdOnClick');

const HoldControlButton = holdOnClick(ControlButton);

module.exports = HoldControlButton;
