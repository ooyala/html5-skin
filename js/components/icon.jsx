import React from 'react';
import PropTypes from 'prop-types';
import Utils from './utils';

/**
 * Create and manage icon element
 */
class Icon extends React.Component {
  /**
   * Define if component should get updated
   * @param {Object} nextProps - the next props object
   * @returns {boolean} the decision
   */
  shouldComponentUpdate(nextProps) {
    const { icon, className, style } = this.props;
    return this.props
      && (icon !== nextProps.icon || className !== nextProps.className || style !== nextProps.style);
  }

  render() {
    const {
      className,
      icon,
      onMouseOver,
      onMouseOut,
      onClick,
      skinConfig,
      style,
    } = this.props;
    const skinIcon = skinConfig.icons ? skinConfig.icons[icon] : null;
    const fontFamilyName = skinIcon ? skinIcon.fontFamilyName : '';
    const iconStyle = Utils.extend({ fontFamily: fontFamilyName }, style);
    const fontStyleClass = skinIcon ? skinIcon.fontStyleClass : '';
    const fontString = skinIcon ? skinIcon.fontString : '';
    return (
      <span // eslint-disable-line
        className={`${fontStyleClass} ${className}`}
        style={iconStyle}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onClick={onClick}
      >
        {fontString}
      </span>
    );
  }
}

Icon.propTypes = {
  icon: PropTypes.string,
  skinConfig: PropTypes.shape({}),
  className: PropTypes.string,
  style: PropTypes.shape({}),
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func,
  onClick: PropTypes.func,
};

Icon.defaultProps = {
  icon: '',
  skinConfig: {},
  className: '',
  style: {},
  onMouseOver: () => {},
  onMouseOut: () => {},
  onClick: () => {},
};

module.exports = Icon;
