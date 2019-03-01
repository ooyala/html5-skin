import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import ControlButton from './controlButton';
import CONSTANTS from '../constants/constants';

/**
 * A vr video rotation control button
 */
class DirectionControlVr extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isTouched: false,
    };
    this.rotateVrVideo = this.rotateVrVideo.bind(this);
    this.handleMouseOrTouchEvent = this.handleMouseOrTouchEvent.bind(this);
    this.handleKeyboardEvent = this.handleKeyboardEvent.bind(this);
  }

  /**
   * Rotate the image in the specified direction or stop the rotation
   * if an user moves the video
   * @param {Event} event - event object
   * @param {Boolean} isRotated - flag to show if the video is needed to be rotated
   */
  rotateVrVideo(event, isRotated) {
    const { isTouched } = this.state;
    const { dir, handleVrViewControlsClick } = this.props;
    if ((!isTouched && isRotated) || (isTouched && !isRotated)) {
      handleVrViewControlsClick(event, isRotated, dir);
      this.setState({
        isTouched: isRotated,
      });
    }
  }

  /**
   * When an user touch or move video need to do rotation
   * @param {Event} event - event object
   */
  handleMouseOrTouchEvent(event) {
    const isRotated = event && (event.type === 'mousedown' || event.type === 'touchstart');
    this.rotateVrVideo(event, isRotated);
  }

  /**
   * When an user touch or move video need to do rotation
   * @param {Event} event - event object
   */
  handleKeyboardEvent(event) {
    const charCode = event.which || event.keyCode;
    const enterCharCode = CONSTANTS.KEYCODES.ENTER_KEY;
    const spaceCharCode = CONSTANTS.KEYCODES.SPACE_KEY;
    const isRotated = event
      && (event.type === 'keydown' && (charCode === enterCharCode || charCode === spaceCharCode));
    this.rotateVrVideo(event, isRotated);
  }

  render() {
    const baseDirectionClass = 'oo-vr-icon--move';
    const {
      dir, focusId, ariaLabel, tooltip,
      language, localizableStrings, responsiveView, skinConfig, controller,
    } = this.props;
    const { isTouched } = this.state;
    const directionClass = `${baseDirectionClass}--${dir}`;
    let touchedDirectionClass = '';
    if (isTouched) {
      touchedDirectionClass = `${directionClass}--touched`;
    }
    return (
      <ControlButton
        className={classnames(
          'oo-direction-control',
          baseDirectionClass,
          directionClass,
          touchedDirectionClass
        )}
        onMouseDown={this.handleMouseOrTouchEvent}
        onMouseUp={this.handleMouseOrTouchEvent}
        onMouseOut={this.handleMouseOrTouchEvent}
        onTouchStart={this.handleMouseOrTouchEvent}
        onTouchEnd={this.handleMouseOrTouchEvent}
        onBlur={this.handleMouseOrTouchEvent}
        onKeyDown={this.handleKeyboardEvent}
        onKeyUp={this.handleKeyboardEvent}
        language={language}
        localizableStrings={localizableStrings}
        responsiveView={responsiveView}
        skinConfig={skinConfig}
        controller={controller}
        key={focusId}
        focusId={focusId}
        ariaLabel={ariaLabel}
        tooltip={tooltip}
      />
    );
  }
}

DirectionControlVr.propTypes = {
  dir: PropTypes.string,
  focusId: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
  ariaLabel: PropTypes.string,
  language: PropTypes.string,
  responsiveView: PropTypes.string,
  controller: PropTypes.shape({
    state: PropTypes.shape({
      isMobile: PropTypes.bool.isRequired,
    }),
  }).isRequired,
  skinConfig: PropTypes.shape({}).isRequired,
  localizableStrings: PropTypes.shape({}),
  handleVrViewControlsClick: PropTypes.func,
};

DirectionControlVr.defaultProps = {
  dir: undefined,
  tooltip: '',
  ariaLabel: '',
  language: 'en',
  localizableStrings: {},
  responsiveView: 'md',
  handleVrViewControlsClick: () => {},
};

export default DirectionControlVr;
