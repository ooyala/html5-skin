const React = require('react');
const PropTypes = require('prop-types');
const ClassNames = require('classnames');
const CONSTANTS = require('../constants/constants');
const utils = require('./utils');

/**
 * The panel to display that player currently casting to receiver
 */
class CastPanel extends React.Component {

  /**
   * Prevent update if connection status not changed
   * @param {Object} nextProps - list of props
   * @returns {boolean} to update or not
   */
  shouldComponentUpdate(nextProps) {
    return nextProps.connected !== this.props.connected;
  }

  render() {
    const connectedText = utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.CONNECTED_TO,
      this.props.localizableStrings
    );
    const castPanelClass = ClassNames({
      'oo-info-panel-cast': true,
      'oo-inactive': !this.props.connected
    },
    this.props.className);
    
    return (
      <div className={castPanelClass}>
        <p>{connectedText} <span>{this.props.device}</span></p>
      </div>
    );
  }
}

CastPanel.propTypes = {
  device: PropTypes.string,
  connected: PropTypes.bool,
  language: PropTypes.string,
  localizableStrings: PropTypes.object,
};

CastPanel.defaultProps = {
  device: '',
  connected: false,
  language: 'en',
  localizableStrings: { 'en': {} },
};

module.exports = CastPanel;