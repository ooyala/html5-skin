var React = require('react');
var CONSTANTS = require('../constants/constants');

var Popover = React.createClass({

  componentDidMount: function() {
    this.onKeyDown = this.onKeyDown.bind(this);
    document.addEventListener('keydown', this.onKeyDown);

    this.autoFocusFirstElement();
  },

  componentWillUnmount: function() {
    document.removeEventListener('keydown', this.onKeyDown);
  },

  /**
   * Gives keyboard focus to the first focusable element on this popover.
   * @private
   */
  autoFocusFirstElement: function() {
    if (this.props.autoFocus && this.domElement) {
      var firstFocusableElement = this.domElement.querySelector('[data-focus-id]');

      if (firstFocusableElement && typeof firstFocusableElement.focus === 'function') {
        firstFocusableElement.focus();
      }
    }
  },

  onKeyDown: function(event) {
    if (!this.props.toggleEnabled || typeof this.props.toggleAction !== 'function') {
      return;
    }
    switch (event.key) {
      case CONSTANTS.KEY_VALUES.ESCAPE:
        this.props.toggleAction();
      default:
        break;
    }
  },

  render: function() {
    return (
      <div
        className={this.props.popoverClassName}
        ref={function(e) { this.domElement = e; }.bind(this)}>
        {this.props.children}
      </div>
    );
  }
});

Popover.defaultProps = {
  popoverClassName: 'oo-popover',
};

module.exports = Popover;
