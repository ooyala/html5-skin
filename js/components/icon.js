const React = require('react');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const Utils = require('./utils');

const Icon = createReactClass({
  shouldComponentUpdate(nextProps) {
    let updateComponent = false;
    if (this.props && (this.props.icon !== nextProps.icon || this.props.className !== nextProps.className || this.props.style !== nextProps.style)) {
      updateComponent = true;
    }
    return updateComponent;
  },

  render() {
    let fontFamilyName = '';
    if (this.props.skinConfig.icons && this.props.skinConfig.icons[this.props.icon]) {
      fontFamilyName = this.props.skinConfig.icons[this.props.icon].fontFamilyName;
    }
    const iconStyle = Utils.extend(
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
        className={`${fontStyleClass} ${this.props.className}`}
        style={iconStyle}
        onMouseOver={this.props.onMouseOver}
        onMouseOut={this.props.onMouseOut}
        onClick={this.props.onClick}
      >
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
