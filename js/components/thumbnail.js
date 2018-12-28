/**
 * Thumbnail component
 *
 * @module Thumbnail
 */
let React = require('react');
let createReactClass = require('create-react-class');
let PropTypes = require('prop-types');

let Thumbnail = createReactClass({
  componentDidMount: function() {
    this.props.onRef(this);
  },

  shouldComponentUpdate: function(nextProps) {
    let updateHoverPositon = nextProps.hoverPosition !== this.props.hoverPosition;
    let updateFullscreen = nextProps.fullscreen !== this.props.fullscreen && this.props.videoVr;
    let updateVrViewDirection = nextProps.vrViewingDirection !== this.props.vrViewingDirection;
    let updateImageWidth = nextProps.imageWidth !== this.props.imageWidth;
    return updateHoverPositon || updateFullscreen || updateVrViewDirection || updateImageWidth;
  },

  componentWillUnmount: function() {
    this.props.onRef(undefined);
  },

  render: function() {
    let thumbnailClassName = 'oo-thumbnail';

    if (this.props.videoVr) {
      thumbnailClassName += ' oo-thumbnail-vr';
    }

    return (
      <div className="oo-scrubber-thumbnail-container">
        <div className={thumbnailClassName} ref="thumbnail" style={this.props.thumbnailStyle}>
          <div className="oo-thumbnail-time">{this.props.time}</div>
        </div>
      </div>
    );
  },
});

Thumbnail.defaultProps = {
  thumbnails: {},
  hoverPosition: 0,
  duration: 0,
  hoverTime: 0,
  vrViewingDirection: { yaw: 0, roll: 0, pitch: 0 },
  videoVr: false,
  fullscreen: false,
  positionY: 0,
  positionX: 0,
  imageWidth: 0,
};

Thumbnail.propTypes = {
  onRef: PropTypes.func,
  thumbnailStyle: PropTypes.object,
  vrViewingDirection: PropTypes.shape({
    yaw: PropTypes.number,
    roll: PropTypes.number,
    pitch: PropTypes.number,
  }),
  time: PropTypes.string,
  positionY: PropTypes.number,
  positionX: PropTypes.number,
  imageWidth: PropTypes.number,
  videoVr: PropTypes.bool,
  fullscreen: PropTypes.bool,
};

module.exports = Thumbnail;
