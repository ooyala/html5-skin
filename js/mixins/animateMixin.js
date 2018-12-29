/**
 * Enable animation after component mounts
 * Set animate state var 1ms after component mounts
 * animate state var used to add css class to element
 *
 * @mixin AnimateMixin
 * @fires startAnimation()
 * @this component using AnimateMixin
 */

const AnimateMixin = {
  getInitialState() {
    return {
      animate: false,
    };
  },

  componentDidMount() {
    this.animateTimer = setTimeout(this.startAnimation, 1);
  },

  componentWillUnmount() {
    clearTimeout(this.animateTimer);
  },

  startAnimation() {
    this.setState({
      animate: true,
    });
  },
};
module.exports = AnimateMixin;
