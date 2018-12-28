let React = require('react');
let Utils = require('./utils');
let createReactClass = require('create-react-class');
let PropTypes = require('prop-types');

let Icon = createReactClass({
  shouldComponentUpdate: function(nextProps) {
    let updateComponent = false;
    if (this.props && (this.props.icon !== nextProps.icon || this.props.className !== nextProps.className || this.props.style !== nextProps.style)) {
      updateComponent = true;
    }
    return updateComponent;
  },

  render: function() {
    let fontFamilyName = '';
    if (this.props.skinConfig.icons && this.props.skinConfig.icons[this.props.icon]) {
      fontFamilyName = this.props.skinConfig.icons[this.props.icon].fontFamilyName;
    }
    let iconStyle = Utils.extend(
      { fontFamily: fontFamilyName },
      this.props.style
    );

    let fontStyleClass = '';
    if (this.props.skinConfig.icons && this.props.skinConfig.icons[this.props.icon]) {
      fontStyleClass = this.props.skinConfig.icons[this.props.icon].fontStyleClass;
    }

    let fontString = '';
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
        {fontString}
      </span>
    );
  },
});

Icon.propTypes = {
  icon: PropTypes.string,
  skinConfig: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
};

Icon.defaultProps = {
  icon: '',
  skinConfig: {},
  className: '',
  style: {},
};

module.exports = Icon;
