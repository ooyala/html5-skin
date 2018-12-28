/**
 * Enables accessability controls.
 *
 * @mixin AccessibilityMixin
 * @requires this.props.controller.state.accessibilityControlsEnabled
 */
let AccessibilityMixin = {
  componentDidMount: function() {
    this.props.controller.state.accessibilityControlsEnabled = false;
  },

  componentWillUnmount: function() {
    this.props.controller.state.accessibilityControlsEnabled = true;
  },
};
module.exports = AccessibilityMixin;
