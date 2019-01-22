import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

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
    const isRotated = event && (event.type === 'mousedown' || event.type === 'touchstart');
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
    const { dir } = this.props;
    const { isTouched } = this.state;
    const directionClass = `${baseDirectionClass}--${dir}`;
    let touchedDirectionClass = '';
    if (isTouched) {
      touchedDirectionClass = `${directionClass}--touched`;
    }
    return (
      <div // eslint-disable-line
        className={classnames(
          'oo-direction-control',
          baseDirectionClass,
          directionClass,
          touchedDirectionClass
        )}
        key={dir}
        onMouseDown={this.rotateVrVideo}
        onTouchStart={this.rotateVrVideo}
        onMouseUp={this.rotateVrVideo}
        onTouchEnd={this.rotateVrVideo}
        onMouseOut={this.rotateVrVideo}
      />
    );
  }
}

DirectionControlVr.propTypes = {
  dir: PropTypes.string,
  handleVrViewControlsClick: PropTypes.func,
};

DirectionControlVr.defaultProps = {
  dir: undefined,
  handleVrViewControlsClick: () => {},
};

export default DirectionControlVr;
