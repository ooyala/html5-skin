var React = require('react');
var Utils = require('./utils');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');


var Icon = createReactClass({
  shouldComponentUpdate: function(nextProps) {
    var updateComponent = false;
    if (this.props && (this.props.icon !== nextProps.icon || this.props.className !== nextProps.className)) {
      updateComponent = true;
    }
    return updateComponent;
  },

  render: function() {
    var fontFamilyName = '';
    if (this.props.skinConfig.icons && this.props.skinConfig.icons[this.props.icon]) {
      fontFamilyName = this.props.skinConfig.icons[this.props.icon].fontFamilyName;
    }
    var iconStyle = Utils.extend(
      { fontFamily: fontFamilyName },
      this.props.style
    );

    var fontStyleClass = '';
    if (this.props.skinConfig.icons && this.props.skinConfig.icons[this.props.icon]) {
      fontStyleClass = this.props.skinConfig.icons[this.props.icon].fontStyleClass;
    }

    var fontString = '';
    if (this.props.skinConfig.icons && this.props.skinConfig.icons[this.props.icon]) {
      fontString = this.props.skinConfig.icons[this.props.icon].fontString;
    }

    return (
      <span
        className={fontStyleClass + ' ' + this.props.className}
        style={iconStyle}
        onMouseOver={this.props.onMouseOver}
        onMouseOut={this.props.onMouseOut}
        onClick={this.props.onClick}>
        {this.props.skinConfig.icons[this.props.icon].fontString}
      </span>
    );
  }
});

Icon.propTypes = {
  icon: PropTypes.string,
  skinConfig: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object
};

Icon.defaultProps = {
  icon: '',
  skinConfig: {},
  className: '',
  style: {}
};

module.exports = Icon;
