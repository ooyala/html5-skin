var React = require('react'),
    Utils = require('./utils'),
    Icon = require('../components/icon');

var CloseButton = React.createClass({
  highlight: function(evt) {
    var color = this.props.skinConfig.controlBar.iconStyle.active.color;
    var opacity = this.props.skinConfig.controlBar.iconStyle.active.opacity;

    Utils.highlight(evt.target, opacity, color);
  },

  removeHighlight: function(evt) {
    var color = this.props.skinConfig.controlBar.iconStyle.inactive.color;
    var opacity = this.props.skinConfig.controlBar.iconStyle.inactive.opacity;
    Utils.removeHighlight(evt.target, opacity, color);
  },

  setupItemStyle: function() {
    var returnStyles = {};

    returnStyles.iconCharacter = {
      color: this.props.skinConfig.controlBar.iconStyle.inactive.color,
      opacity: this.props.skinConfig.controlBar.iconStyle.inactive.opacity

    };
    return returnStyles;
  },

  render: function() {
    var dynamicStyles = this.setupItemStyle();
    return (
        <button className={this.props.cssClass}
          onClick={this.props.closeAction}>
          <Icon {...this.props} icon="dismiss"
            className={this.props.cssClass} style={dynamicStyles.iconCharacter} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}/>
        </button>
    );
  }
});

CloseButton.propTypes = {
  closeAction: React.PropTypes.func,
  fontStyleClass: React.PropTypes.string,
  cssClass: React.PropTypes.string
};

CloseButton.defaultProps = {
  cssClass: 'oo-close-button'
};

module.exports = CloseButton;