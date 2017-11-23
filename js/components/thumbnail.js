/**
 * Thumbnail component
 *
 * @module Thumbnail
 */
var React = require('react'),
    Utils = require('./utils');

var Thumbnail = React.createClass({
  componentDidMount: function() {
    this.props.onRef(this);
  },

  shouldComponentUpdate: function(nextProps) {
    var updateHoverPositon = nextProps.hoverPosition != this.props.hoverPosition;
    var updateFullscreen  = nextProps.fullscreen != this.props.fullscreen && this.props.videoVr;
    var updateVrViewDirection = nextProps.vrViewingDirection != this.props.vrViewingDirection;
    return (updateHoverPositon || updateFullscreen || updateVrViewDirection);
  },

  componentWillUnmount: function() {
    this.props.onRef(undefined);
  },

  render: function() {
    var thumbnail = Utils.findThumbnail(this.props.thumbnails, this.props.hoverTime, this.props.duration, this.props.videoVr);
    var time = isFinite(parseInt(this.props.hoverTime)) ? Utils.formatSeconds(parseInt(this.props.hoverTime)) : null;

    var thumbnailStyle = {};
    thumbnailStyle.left = this.props.hoverPosition;
    if (Utils.isValidString(thumbnail.url)) {
      thumbnailStyle.backgroundImage = "url('" + thumbnail.url + "')";
    }

    var thumbnailClassName = "oo-thumbnail";

    if (this.props.videoVr) {
      thumbnailStyle.backgroundSize = this.props.imageWidth + "px " + this.props.imageHeight + "px";
      thumbnailStyle.backgroundPosition = this.props.positionX + "px " + this.props.positionY + "px";
      thumbnailClassName += " oo-thumbnail-vr";
    }

    return (
      <div className="oo-scrubber-thumbnail-container">
        <div className={thumbnailClassName} ref="thumbnail" style={thumbnailStyle}>
          <div className="oo-thumbnail-time">{time}</div>
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
  imageWidth: 0,
  imageHeight: 0
};

Thumbnail.propTypes = {
  onRef: React.PropTypes.func,
  vrViewingDirection: React.PropTypes.shape({
    yaw: React.PropTypes.number,
    roll: React.PropTypes.number,
    pitch: React.PropTypes.number
  }),
  positionY: React.PropTypes.number,
  positionX: React.PropTypes.number,
  imageWidth: React.PropTypes.number,
  imageHeight: React.PropTypes.number,
  videoVr: React.PropTypes.bool,
  fullscreen: React.PropTypes.bool
};

module.exports = Thumbnail;