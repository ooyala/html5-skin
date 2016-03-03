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

  render: function() {
    return (
        <button className={this.props.cssClass} onClick={this.props.closeAction}>
          <span className={this.props.fontStyleClass} style={{fontFamily: this.props.fontFamilyName}}>
            {this.props.fontString}
          </span>
        </button>
    );
  }
});
module.exports = CloseButton;