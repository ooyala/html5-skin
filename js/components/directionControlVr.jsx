import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import ControlButton from './controlButton';

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
  }

  /**
   * Rotate the image in the specified direction or stop the rotation if the user has stopped clicking on the item
   * @param {Event} event - event object
   */
  rotateVrVideo(event) {
    const charCode = event.which || event.keyCode;
    const enterCharCode = 13;
    const spaceCharCode = 32;
    const isRotated = event
      && (
        event.type === 'mousedown'
        || event.type === 'touchstart'
        || (event.type === 'keydown' && (charCode === enterCharCode || charCode === spaceCharCode))
      );
    const { isTouched } = this.state;
    const { dir, handleVrViewControlsClick } = this.props;
    if ((!isTouched && isRotated) || (isTouched && !isRotated)) {
      handleVrViewControlsClick(event, isRotated, dir);
      this.setState({
        isTouched: isRotated,
      });
    }
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
        onMouseDown={this.rotateVrVideo}
        onTouchStart={this.rotateVrVideo}
        onMouseUp={this.rotateVrVideo}
        onTouchEnd={this.rotateVrVideo}
        onMouseOut={this.rotateVrVideo}
        onBlur={this.rotateVrVideo}
        onKeyDown={this.rotateVrVideo}
        onKeyUp={this.rotateVrVideo}
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
    state : {
      isMobile: PropTypes.bool.isRequired
    }
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
