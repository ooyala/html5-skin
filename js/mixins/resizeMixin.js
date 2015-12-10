/**
 * Adds and removes event listeners for window resize.
 *
 * @mixin ResizeMixin
 * @requires handleResize()
 * @listens resize
 * @listens webkitfullscreenchange
 * @listens mozfullscreenchange
 * @listens fullscreenchange
 * @listens msfullscreenchange
 */
var ResizeMixin = {
  componentDidMount: function() {
    // Make sure component resize correctly after switch to fullscreen/inline screen
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('webkitfullscreenchange', this.handleResize);
    window.addEventListener('mozfullscreenchange', this.handleResize);
    window.addEventListener('fullscreenchange', this.handleResize);
    window.addEventListener('msfullscreenchange', this.handleResize);
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('webkitfullscreenchange', this.handleResize);
    window.removeEventListener('mozfullscreenchange', this.handleResize);
    window.removeEventListener('fullscreenchange', this.handleResize);
    window.removeEventListener('msfullscreenchange', this.handleResize);
  }
};
module.exports = ResizeMixin;