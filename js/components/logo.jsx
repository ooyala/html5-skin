import React from 'react';
import PropTypes from 'prop-types';


const Logo = (props) => {
  const {
    clickUrl,
    height,
    imageUrl,
    target,
    width,
    style,
  } = props;
  const content = clickUrl ? (
    <a href={clickUrl} target={target}>
      <img width={width} height={height} src={imageUrl} alt="" />
    </a>
  ) : (
    <img width={width} height={height} src={imageUrl} alt="" />
  );

  return (
    <div className="oo-logo oo-control-bar-item" style={style}>
      {content}
    </div>
  );
};

Logo.propTypes = {
  imageUrl: PropTypes.string,
  clickUrl: PropTypes.string,
  target: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.shape({}),
};

Logo.defaultProps = {
  imageUrl: '/assets/images/ooyala.png',
  clickUrl: '',
  target: '_blank',
  width: null,
  height: null,
  style: {},
};

module.exports = Logo;
