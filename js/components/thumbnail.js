/**
 * Thumbnail component
 *
 * @module Thumbnail
 */
var React = require('react'),
    Utils = require('./utils'),
    CONSTANTS = require('../constants/constants'),
    ReactDOM = require('react-dom');

var Thumbnail = React.createClass({
  getInitialState: function() {
    this.positionY = 0;
    this.positionX = -320;
    this.imageWidth = 0;
    this.imageHeight = 0;
    this.thumbnailWidth = 80;
    this.thumbnailHeight = 40;
    return {};
  },
  componentDidMount: function() {
    if (this.props.videoVr) {
      this.setThumbnailSizes();
      this.setImageSizes();
      var yaw = this.props.vrViewingDirection.yaw;
      var pitch = this.props.vrViewingDirection.pitch;
      this.setCurrentViewVr(yaw, pitch);
    }
  },
  componentWillReceiveProps: function(nextProps) {
    if (this.props.vrViewingDirection !== nextProps.vrViewingDirection && this.props.videoVr) {
      var yaw = nextProps.vrViewingDirection.yaw;
      var pitch = nextProps.vrViewingDirection.pitch;
      this.setCurrentViewVr(yaw, pitch);
    }
  },
  shouldComponentUpdate: function(nextProps) {
    var updateHoverPositon = nextProps.hoverPosition != this.props.hoverPosition;
    var updateFullscreen  = nextProps.fullscreen != this.props.fullscreen && this.props.videoVr;
    var updateVrViewDirection = nextProps.vrViewingDirection != this.props.vrViewingDirection;
    return (updateHoverPositon || updateFullscreen || updateVrViewDirection);
  },
  componentDidUpdate: function(prevProps, prevState) {
    if (this.props.videoVr) {
      var newThumbnailWidth = ReactDOM.findDOMNode(this.refs.thumbnail).clientWidth;
      var newThumbnailHeight = ReactDOM.findDOMNode(this.refs.thumbnail).clientHeight;
      if (newThumbnailWidth !== this.thumbnailWidth || newThumbnailHeight !== this.thumbnailHeight) {
        this.thumbnailWidth = newThumbnailWidth;
        this.thumbnailHeight = newThumbnailHeight;
        var yaw = this.props.vrViewingDirection.yaw;
        var pitch = this.props.vrViewingDirection.pitch;
        this.setCurrentViewVr(yaw, pitch);
      }
    }
  },

  setThumbnailSizes: function() {
    var thumbnailWidth = ReactDOM.findDOMNode(this.refs.thumbnail).clientWidth;
    var thumbnailHeight = ReactDOM.findDOMNode(this.refs.thumbnail).clientHeight;
    if (thumbnailWidth) {
      this.thumbnailWidth = thumbnailWidth;
    }
    if (thumbnailHeight) {
      this.thumbnailHeight = thumbnailHeight;
    }
  },

  setImageSizes: function() {
    var thumbnail = Utils.findThumbnail(this.props.thumbnails, this.props.hoverTime, this.props.duration, this.props.videoVr);
    if (thumbnail !== null && typeof thumbnail === 'object') {
      var imageWidth = thumbnail.imageWidth;
      var imageHeight = thumbnail.imageHeight;
      if (imageWidth && imageHeight) {
        if (imageWidth > CONSTANTS.THUMBNAIL.MAX_VR_THUMBNAIL_BG_WIDTH) {
          imageWidth = CONSTANTS.THUMBNAIL.MAX_VR_THUMBNAIL_BG_WIDTH;
          imageHeight = thumbnail.imageHeight * CONSTANTS.THUMBNAIL.MAX_VR_THUMBNAIL_BG_WIDTH / thumbnail.imageWidth;
        }
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
      }
    }
  },

  /**
   * @description set positions for a thumbnail image when a video is vr
   * @param {Number} yaw - rotation around the vertical axis in degrees (returns after changing direction)
   * @param {Number} pitch - rotation around the horizontal axis in degrees (returns after changing direction)
   * @private
   */
  setCurrentViewVr: function(yaw, pitch) {
    yaw = Utils.ensureNumber(yaw, 0);
    pitch = Utils.ensureNumber(pitch, 0);
    var imageWidth = this.imageWidth;
    var imageHeight = this.imageHeight;
    var thumbnailWidth = this.thumbnailWidth;
    var thumbnailHeight = this.thumbnailHeight;
    yaw = this.getCurrentYawVr(yaw);
    pitch = pitch >= 360 ? 0 : pitch;

    var positionY = -(((imageHeight - thumbnailHeight) / 2) - pitch);
    var bottomCoordinate = -(imageHeight - thumbnailHeight);
    if (positionY > 0) {
      positionY = 0;
    } else if (positionY < bottomCoordinate) {
      positionY = bottomCoordinate;
    }
    var positionX = -(imageWidth - thumbnailWidth / 2 - imageWidth * yaw / 360);
    this.positionY = positionY;
    this.positionX = positionX;
  },

  /**
   * @description return current coefficient of the yaw if yaw > 360 or yaw < -360 degrees
   * @param {Number} yaw - angle in degrees
   * @private
   * @returns {number} coefficient showing how many times to take 360 degrees
   */
  getCurrentYawVr: function(yaw) {
    var k = yaw <= -360 ? -1 : 1;
    var ratio = k * yaw / 360;
    ratio = ~~ratio;
    var coef = yaw - k * ratio * 360;
    return coef;
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
      thumbnailStyle.backgroundSize = this.imageWidth + "px " + this.imageHeight + "px";
      thumbnailStyle.backgroundPosition = this.positionX + "px " + this.positionY + "px";
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
  fullscreen: false
};

Thumbnail.propTypes = {
  vrViewingDirection: React.PropTypes.shape({
    yaw: React.PropTypes.number,
    roll: React.PropTypes.number,
    pitch: React.PropTypes.number
  }),
  videoVr: React.PropTypes.bool,
  fullscreen: React.PropTypes.bool
};

module.exports = Thumbnail;