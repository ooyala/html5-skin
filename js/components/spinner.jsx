import React from 'react';
import PropTypes from 'prop-types';

const Spinner = (props) => {
  const { loadingImage } = props;
  return (
    <div className="oo-spinner-screen">
      <div className="oo-spinner-wrapper">
        <img src={loadingImage} className="oo-spinner" alt="spinner" />
      </div>
    </div>
  );
};

Spinner.propTypes = {
  loadingImage: PropTypes.string.isRequired,
};

module.exports = Spinner;
