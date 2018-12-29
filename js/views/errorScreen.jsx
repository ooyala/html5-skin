import React from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import CONSTANTS from '../constants/constants';
import Utils from '../components/utils';
/* eslint-disable react/destructuring-assignment */

/**
 * Display errors in user friendly screen
 */
class ErrorScreen extends React.Component {
  componentDidMount() {
    this.props.controller.state.accessibilityControlsEnabled = false;
  }

  componentWillUnmount() {
    this.props.controller.state.accessibilityControlsEnabled = true;
  }

  render() {
    let errorTitle;
    let errorDescription;
    let errorAction;
    if (CONSTANTS.ERROR_MESSAGE.hasOwnProperty(this.props.errorCode.code)) { // eslint-disable-line
      errorAction = CONSTANTS.SKIN_TEXT.ERROR_ACTION;
      if (CONSTANTS.ERROR_MESSAGE[this.props.errorCode.code].action) {
        errorAction = CONSTANTS.ERROR_MESSAGE[this.props.errorCode.code].action;
      }

      errorTitle = Utils.getLocalizedString(
        this.props.language,
        CONSTANTS.ERROR_MESSAGE[this.props.errorCode.code].title,
        this.props.localizableStrings
      );

      errorDescription = Utils.getLocalizedString(
        this.props.language,
        CONSTANTS.ERROR_MESSAGE[this.props.errorCode.code].description,
        this.props.localizableStrings
      );

      // TODO - need to make countdown functionality display for all languages
      const startTime = this.props.errorCode.flight_start_time;
      if (
        this.props.errorCode.code === CONSTANTS.ERROR_CODE.FUTURE
        && this.props.language === CONSTANTS.LANGUAGE.ENGLISH
        && startTime !== null
        && !Number.isNaN(startTime)
      ) {
        const second = 1000;
        errorDescription = 'This video will be available in '
          + `${Utils.getStartCountdown(startTime * second - Date.now())}`;
      }
      errorAction = Utils.getLocalizedString(this.props.language, errorAction, this.props.localizableStrings);
    } else {
      errorDescription = Utils.getLocalizedString(
        this.props.language,
        CONSTANTS.SKIN_TEXT.UNKNOWN_ERROR,
        this.props.localizableStrings
      );
      errorTitle = null;
      errorAction = null;
    }

    const errorContentClass = ClassNames({
      'oo-error-content': true,
      'oo-center-block': true,
    });

    return (
      <div className="oo-state-screen oo-error-screen">
        <div className={errorContentClass}>
          <div className="oo-error-title oo-text-uppercase">{errorTitle}</div>
          <div className="oo-error-description">{errorDescription}</div>
          <div className="oo-error-action oo-text-uppercase">{errorAction}</div>
        </div>
      </div>
    );
  }
}

ErrorScreen.propTypes = {
  controller: PropTypes.shape({
    state: PropTypes.shape({
      accessibilityControlsEnabled: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
  errorCode: PropTypes.shape({
    code: PropTypes.string,
    flight_start_time: PropTypes.number,
  }).isRequired,
  language: PropTypes.string,
  localizableStrings: PropTypes.object, // eslint-disable-line
};

ErrorScreen.defaultProps = {
  language: 'en',
  localizableStrings: {},
};

module.exports = ErrorScreen;
