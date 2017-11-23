/**
 * Thumbnail component
 *
 * @module Thumbnail
 */
var React = require('react'),
  Utils = require('./utils'),
  CONSTANTS = require('../constants/constants'),
  Thumbnail = require('./thumbnail'),
  ThumbnailCarousel = require('./thumbnailCarousel');

var ThumbnailContainer = React.createClass({
  getInitialState: function() {
    this.child = null;
    this.positionY = 0;
    this.positionX = 0;
    this.imageWidth = 0;
    this.imageHeight = 0;
    this.thumbnailWidth = 0;
    this.thumbnailHeight = 0;
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
  componentDidUpdate: function(prevProps, prevState) {
    if (this.props.videoVr) {
      if (this.child !== null && typeof this.child === 'object') {
        if (this.child.refs && this.child.refs.thumbnail) {
          var newThumbnailWidth = this.child.refs.thumbnail.clientWidth;
          var newThumbnailHeight = this.child.refs.thumbnail.clientHeight;
          if (newThumbnailWidth !== this.thumbnailWidth || newThumbnailHeight !== this.thumbnailHeight) {
            this.thumbnailWidth = newThumbnailWidth;
            this.thumbnailHeight = newThumbnailHeight;
            var yaw = this.props.vrViewingDirection.yaw;
            var pitch = this.props.vrViewingDirection.pitch;
            this.setCurrentViewVr(yaw, pitch);
          }
        }
      }
    }
  },

  setThumbnailSizes: function() {
    if (this.child !== null && typeof this.child === 'object') {
      if (this.child.refs && this.child.refs.thumbnail) {
        var thumbnailWidth = this.child.refs.thumbnail.clientWidth;
        var thumbnailHeight = this.child.refs.thumbnail.clientHeight;
        if (thumbnailWidth) {
          this.thumbnailWidth = thumbnailWidth;
        }
        if (thumbnailHeight) {
          this.thumbnailHeight = thumbnailHeight;
        }
      }
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

  /**x
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

  onRef: function(ref) {
    this.child = ref;
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

    var thumbnailContainerClass = "";
    if (this.props.thumbnailContainerClass !== undefined) {
      thumbnailContainerClass = this.props.thumbnailContainerClass;
    }

    var thumbnail = null;

    if (this.props.isCarousel) {
      thumbnail =
        <ThumbnailCarousel
          onRef={this.onRef}
          time={time}
          thumbnails={this.props.thumbnails}
          duration={this.props.duration}
          hoverTime={this.props.hoverTime}
          scrubberBarWidth={this.props.scrubberBarWidth}
          hoverPosition={this.props.hoverPosition}
          vrViewingDirection={this.props.vrViewingDirection}
          videoVr={this.props.videoVr}
          fullscreen={this.props.fullscreen}
          positionY={this.positionY}
          positionX={this.positionX}
          imageWidth={this.imageWidth}
          imageHeight={this.imageHeight}
        />
    } else {
      thumbnail = (
        <Thumbnail
          onRef={this.onRef}
          thumbnailClassName={thumbnailClassName}
          time={time}
          thumbnails={this.props.thumbnails}
          hoverPosition={this.props.hoverPosition}
          duration={this.props.duration}
          hoverTime={this.props.hoverTime}
          vrViewingDirection={this.props.vrViewingDirection}
          videoVr={this.props.videoVr}
          fullscreen={this.props.fullscreen}
          positionY={this.positionY}
          positionX={this.positionX}
          imageWidth={this.imageWidth}
          imageHeight={this.imageHeight}
        />
      )
    }

    return (
      <div className={thumbnailContainerClass}>
        {thumbnail}
      </div>
    );
  }
});

ThumbnailContainer.defaultProps = {
  isCarousel: false,
  thumbnails: {},
  hoverPosition: 0,
  duration: 0,
  hoverTime: 0,
  vrViewingDirection: { yaw: 0, roll: 0, pitch: 0 },
  videoVr: false,
  fullscreen: false
};

ThumbnailContainer.propTypes = {
  vrViewingDirection: React.PropTypes.shape({
    yaw: React.PropTypes.number,
    roll: React.PropTypes.number,
    pitch: React.PropTypes.number
  }),
  thumbnails: React.PropTypes.object,
  hoverPosition: React.PropTypes.number,
  hoverTime: React.PropTypes.number,
  duration: React.PropTypes.number,
  scrubberBarWidth: React.PropTypes.number,
  isCarousel: React.PropTypes.bool,
  videoVr: React.PropTypes.bool,
  fullscreen: React.PropTypes.bool
};

module.exports = ThumbnailContainer;