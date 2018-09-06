const React = require('react');
const classnames = require('classnames');
const PropTypes = require('prop-types');

/**
 * A vr video rotation control button
 */
class DirectionControlVr extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isTouched: false
    };
    this.rotateVrVideo = this.rotateVrVideo.bind(this);
  };

  /**
   * Rotate the image in the specified direction or stop the rotation if the user has stopped clicking on the item
   * @param {Event} event - event object
   */
  rotateVrVideo(event) {
    const isRotated = event && (event.type === 'mousedown' || event.type === 'touchstart');
    this.props.handleVrViewControlsClick(event, isRotated, this.props.dir);

    this.setState({
      isTouched: isRotated
    });
  };

  render() {
    const baseDirectionClass = 'oo-vr-icon--move';
    const directionClass = baseDirectionClass + '--' + this.props.dir;
    let touchedDirectionClass = '';
    if (this.state.isTouched) {
      touchedDirectionClass = directionClass + '--touched';
    }
    return (
      <div
        className={classnames(
          'oo-direction-control',
          baseDirectionClass,
          directionClass,
          touchedDirectionClass
        )}
        key={this.props.dir}
        onMouseDown={this.rotateVrVideo}
        onTouchStart={this.rotateVrVideo}
        onMouseUp={this.rotateVrVideo}
        onTouchEnd={this.rotateVrVideo}
        onMouseOut={this.rotateVrVideo}
      />
    );
  }
};

DirectionControlVr.propTypes = {
  handleVrViewControlsClick: PropTypes.func
};

export { DirectionControlVr };
