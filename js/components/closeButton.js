var React = require('react')

var CloseButton = React.createClass({
  propTypes: {
    closeAction: React.PropTypes.func,
    fontStyleClass: React.PropTypes.string,
    cssClass: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      cssClass: 'closeBtn'
    }
  },

  // Odds are we don't want to fire any handlers behind the close button,
  // so we stop them here
  stopEvent: function(event) {
    event.stopPropagation();
    event.cancelBubble = true;
    event.preventDefault();
  },

  render: function() {
    return (
        <button className={this.props.cssClass} onClick={this.props.closeAction}
          onMouseUp={this.stopEvent} onTouchEnd={this.stopEvent}>
          <span className={this.props.fontStyleClass}></span>
        </button>
    );
  }
});
module.exports = CloseButton;