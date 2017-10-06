var React = require('react');
var CONSTANTS = require('../constants/constants');

var Popover = React.createClass({

  componentDidMount: function() {
    this.onKeyDown = this.onKeyDown.bind(this);
    // We listen to the event on the document instead of the element in order to
    // allow closing the popover with ESC even when it doesn't have focus.
    document.addEventListener('keydown', this.onKeyDown);

    if (this.props.autoFocus) {
      Utils.autoFocusFirstElement(this.domElement);
    }
  },

  componentWillUnmount: function() {
    document.removeEventListener('keydown', this.onKeyDown);
  },

  /**
   * Handles the keydown event on the document when the popover is active.
   * @private
   * @param {event} event description
   */
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

Popover.propTypes = {
  popoverClassName: React.PropTypes.string.isRequired,
  toggleEnabled: React.PropTypes.bool,
  toggleAction: React.PropTypes.func
};

Popover.defaultProps = {
  popoverClassName: 'oo-popover',
  toggleEnabled: false,
  toggleAction: function() {},
};

module.exports = Popover;
