const React = require('react');
const PropTypes = require('prop-types');
const ClassNames = require('classnames');
const CONSTANTS = require('../constants/constants');
const utils = require('./utils');

/**
 * The panel to display that player currently casting to receiver
 */
class CastPanel extends React.Component {
  render() {
    const connectedText = utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.CONNECTED_TO,
      this.props.localizableStrings
    );
    const castPanelClass = ClassNames('oo-info-panel-cast', this.props.className);

    return (
      <div className={castPanelClass}>
        <p>{connectedText} <span>{this.props.device}</span></p>
      </div>
    );
  }
}

CastPanel.propTypes = {
  device: PropTypes.string,
  language: PropTypes.string,
  localizableStrings: PropTypes.object,
};

CastPanel.defaultProps = {
  device: '',
  language: 'en',
  localizableStrings: { 'en': {} },
};

module.exports = CastPanel;
