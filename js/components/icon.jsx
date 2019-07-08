import React from 'react';
import PropTypes from 'prop-types';

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
      skinConfig,
      style,
    } = this.props;
    const skinIcon = skinConfig.icons ? skinConfig.icons[icon] : null;
    const fontFamily = skinIcon ? skinIcon.fontFamilyName : '';
    const iconStyle = { fontFamily, ...style };
    const fontStyleClass = skinIcon ? skinIcon.fontStyleClass : '';
    const fontString = skinIcon ? skinIcon.fontString : '';

    return (
      <span
        className={`${fontStyleClass} ${className}`}
        style={iconStyle}
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
};

Icon.defaultProps = {
  icon: '',
  skinConfig: {},
  className: '',
  style: {},
};

module.exports = Icon;
