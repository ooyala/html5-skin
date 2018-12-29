/**
 * Enables accessability controls.
 *
 * @mixin AccessibilityMixin
 * @requires this.props.controller.state.accessibilityControlsEnabled
 */
const AccessibilityMixin = {
  componentDidMount() {
    this.props.controller.state.accessibilityControlsEnabled = false;
  },

  componentWillUnmount() {
    this.props.controller.state.accessibilityControlsEnabled = true;
  },
};
module.exports = AccessibilityMixin;
