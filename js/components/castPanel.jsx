import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import CONSTANTS from '../constants/constants';
import utils from './utils';

const CastPanel = (props) => {
  const {
    language,
    localizableStrings,
    className,
    device,
  } = props;
  const connectedText = utils.getLocalizedString(
    language,
    CONSTANTS.SKIN_TEXT.CONNECTED_TO,
    localizableStrings
  );
  const castPanelClass = ClassNames('oo-info-panel-cast', className);

  return (
    <div className={castPanelClass}>
      <p>
        {connectedText}
        {' '}
        <span>{device}</span>
      </p>
    </div>
  );
};

CastPanel.propTypes = {
  className: PropTypes.string,
  device: PropTypes.string,
  language: PropTypes.string,
  localizableStrings: PropTypes.shape({}),
};

CastPanel.defaultProps = {
  className: '',
  device: '',
  language: 'en',
  localizableStrings: { en: {} },
};

module.exports = CastPanel;
