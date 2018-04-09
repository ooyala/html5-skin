/**
 * Thumbnail component
 *
 * @module Thumbnail
 */
var React = require('react');

var Thumbnail = React.createClass({
  componentDidMount: function() {
    this.props.onRef(this);
  },

  shouldComponentUpdate: function(nextProps) {
    var updateHoverPositon = nextProps.hoverPosition != this.props.hoverPosition;
    var updateFullscreen  = nextProps.fullscreen != this.props.fullscreen && this.props.videoVr;
    var updateVrViewDirection = nextProps.vrViewingDirection != this.props.vrViewingDirection;
    var updateImageWidth = nextProps.imageWidth !== this.props.imageWidth;
    return (updateHoverPositon || updateFullscreen || updateVrViewDirection || updateImageWidth);
  },

  componentWillUnmount: function() {
    this.props.onRef(undefined);
  },

  render: function() {
    var thumbnailClassName = 'oo-thumbnail';

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
  }
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
  imageWidth: 0
};

Thumbnail.propTypes = {
  onRef: React.PropTypes.func,
  thumbnailStyle: React.PropTypes.object,
  vrViewingDirection: React.PropTypes.shape({
    yaw: React.PropTypes.number,
    roll: React.PropTypes.number,
    pitch: React.PropTypes.number
  }),
  time: React.PropTypes.string,
  positionY: React.PropTypes.number,
  positionX: React.PropTypes.number,
  imageWidth: React.PropTypes.number,
  videoVr: React.PropTypes.bool,
  fullscreen: React.PropTypes.bool
};

module.exports = Thumbnail;