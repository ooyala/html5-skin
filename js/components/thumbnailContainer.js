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
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');

var ThumbnailContainer = createReactClass({
  getInitialState: function() {
    this.child = null;
    this.positionY = 0;
    this.positionX = 0;
    this.imageWidth = 0;
    this.imageHeight = 0;
    this.thumbnailWidth = 0;
    this.thumbnailHeight = 0;
    this.thumbnailCarouselWidth = 0;
    this.thumbnailCarouselHeight = 0;
    return {};
  },

  componentDidMount: function() {
    if (this.props.videoVr) {
      this.setThumbnailSizesVr();
      this.setImageSizes();
      var yaw = this.props.vrViewingDirection.yaw;
      var pitch = this.props.vrViewingDirection.pitch;
      var params = {
        yaw: yaw,
        pitch: pitch,
        imageWidth: this.imageWidth,
        imageHeight: this.imageHeight,
        thumbnailWidth: this.thumbnailWidth,
        thumbnailHeight: this.thumbnailHeight
      };
      var positions = this.setBgPositionVr(params);
      if (positions) {
        this.positionX = positions.positionX;
        this.positionY = positions.positionY;
      }
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if (this.props.vrViewingDirection !== nextProps.vrViewingDirection && this.props.videoVr) {
      var yaw = nextProps.vrViewingDirection.yaw;
      var pitch = nextProps.vrViewingDirection.pitch;
      var params = {
        yaw: yaw,
        pitch: pitch,
        imageWidth: this.imageWidth,
        imageHeight: this.imageHeight,
        thumbnailWidth: this.thumbnailWidth,
        thumbnailHeight: this.thumbnailHeight
      };
      var positions = this.setBgPositionVr(params);
      if (positions) {
        this.positionX = positions.positionX;
        this.positionY = positions.positionY;
      }
    }
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (this.props.videoVr) {
      if (this.child !== null && typeof this.child === 'object') {
        if (this.child.refs && this.child.refs.thumbnail) {
          var newThumbnailWidth = this.getClientWidth(this.child.refs.thumbnail);
          var newThumbnailHeight = this.getClientHeight(this.child.refs.thumbnail);
          if (newThumbnailWidth !== this.thumbnailWidth || newThumbnailHeight !== this.thumbnailHeight) {
            this.thumbnailWidth = newThumbnailWidth;
            this.thumbnailHeight = newThumbnailHeight;
            var yaw = this.props.vrViewingDirection.yaw;
            var pitch = this.props.vrViewingDirection.pitch;
            var params = {
              yaw: yaw,
              pitch: pitch,
              imageWidth: this.imageWidth,
              imageHeight: this.imageHeight,
              thumbnailWidth: this.thumbnailWidth,
              thumbnailHeight: this.thumbnailHeight
            };
            var positions = this.setBgPositionVr(params);
            if (positions) {
              this.positionX = positions.positionX;
              this.positionY = positions.positionY;
            }
          }
        }
        if (this.props.isCarousel) {
          if (this.child.refs && this.child.refs.thumbnailCarousel) {
            var newThumbnailCarouselWidth = this.getClientWidth(this.child.refs.thumbnailCarousel);
            var newThumbnailCarouselHeight = this.getClientHeight(this.child.refs.thumbnailCarousel);
            if (newThumbnailCarouselWidth !== this.thumbnailCarouselWidth) {
              this.thumbnailCarouselWidth = newThumbnailCarouselWidth;
            }
            if (newThumbnailCarouselHeight !== this.thumbnailCarouselHeight) {
              this.thumbnailCarouselHeight = newThumbnailCarouselHeight;
            }
          }
        }
      }
    }
  },

  getClientWidth: function(element) {
    //getBoundingClientRect().width returns the unrounded clientWidth. However, jsdom won't allow us to set clientWidth,
    //but we can mock getBoundingClientRect.
    return element && (element.clientWidth || element.getBoundingClientRect().width);
  },

  getClientHeight: function(element) {
    //getBoundingClientRect().height returns the unrounded clientHeight. However, jsdom won't allow us to set clientHeight,
    //but we can mock getBoundingClientRect.
    return element && (element.clientHeight || element.getBoundingClientRect().height);
  },

  setThumbnailSizesVr: function() {
    if (this.child !== null && typeof this.child === 'object') {
      this.setThumbnailSize('thumbnail', 'thumbnailWidth', 'thumbnailHeight');
      if (this.props.isCarousel) {
        this.setThumbnailSize('thumbnailCarousel', 'thumbnailCarouselWidth', 'thumbnailCarouselHeight');
      }
    }
  },

  /**
   * @description set values for thumbnails sizes
   * @private
   * @param {string} refName - name of thumbnail container ref
   * @param {string} widthName - name for width which is associated with the ref
   * @param {string} heightName - name for height which is associated with the ref
   */
  setThumbnailSize: function(refName, widthName, heightName) {
    if (this.child.refs && this.child.refs[refName]) {
      var width = this.getClientWidth(this.child.refs[refName]);
      var height = this.getClientHeight(this.child.refs[refName]);
      if (width) {
        this[widthName] = width;
      }
      if (height) {
        this[heightName] = height;
      }
    }
  },

  setImageSizes: function() {
    var thumbnail = Utils.findThumbnail(
      this.props.thumbnails,
      this.props.hoverTime,
      this.props.duration,
      this.props.videoVr
    );
    if (thumbnail !== null && typeof thumbnail === 'object') {
      var imageWidth = thumbnail.imageWidth;
      var imageHeight = thumbnail.imageHeight;
      if (imageWidth && imageHeight) {
        if (imageWidth > CONSTANTS.THUMBNAIL.MAX_VR_THUMBNAIL_BG_WIDTH) {
          imageWidth = CONSTANTS.THUMBNAIL.MAX_VR_THUMBNAIL_BG_WIDTH;
          imageHeight =
            thumbnail.imageHeight * CONSTANTS.THUMBNAIL.MAX_VR_THUMBNAIL_BG_WIDTH / thumbnail.imageWidth;
        }
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
      }
    }
  },

  /** x
   * @description set positions for a thumbnail image when a video is vr
   * @param {Number} params - object with keys:
   * - {Number} yaw - rotation around the vertical axis in degrees (returns after changing direction)
   * - {Number} pitch - rotation around the horizontal axis in degrees (returns after changing direction)
   * - {Number} imageWidth - width of bg image
   * - {Number} imageHeight - height of bg image
   * - {Number} thumbnailWidth - width of thumbnail image
   * - {Number} thumbnailHeight - height of thumbnail image
   * @private
   * @returns {object} object with positionX, positionY
   */
  setBgPositionVr: function(params) {
    if (!params) {
      return null;
    }
    var yaw = Utils.ensureNumber(params.yaw, 0);
    var pitch = Utils.ensureNumber(params.pitch, 0);
    var imageWidth = Utils.ensureNumber(params.imageWidth, 0);
    var imageHeight = Utils.ensureNumber(params.imageHeight, 0);
    var thumbnailWidth = Utils.ensureNumber(params.thumbnailWidth, 0); // this.thumbnailWidth;
    var thumbnailHeight = Utils.ensureNumber(params.thumbnailHeight, 0); // this.thumbnailHeight;
    yaw = this.getCurrentYawVr(yaw);
    pitch = pitch >= 360 ? 0 : pitch;

    var positionY = -((imageHeight - thumbnailHeight) / 2 - pitch);
    var bottomCoordinate = -(imageHeight - thumbnailHeight);
    if (positionY > 0) {
      positionY = 0;
    } else if (positionY < bottomCoordinate) {
      positionY = bottomCoordinate;
    }
    var positionX = -(imageWidth - thumbnailWidth / 2 - imageWidth * yaw / 360);
    return { positionX: positionX, positionY: positionY };
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
    var time = isFinite(parseInt(this.props.hoverTime))
      ? Utils.formatSeconds(parseInt(this.props.hoverTime))
      : null;
    var thumbnail = null;

    var thumbnails = Utils.findThumbnail(
      this.props.thumbnails,
      this.props.hoverTime,
      this.props.duration,
      this.props.videoVr
    );
    var thumbnailStyle = {};
    thumbnailStyle.left = this.props.hoverPosition;
    if (Utils.isValidString(thumbnails.url)) {
      thumbnailStyle.backgroundImage = 'url(\'' + thumbnails.url + '\')';
    }

    if (this.props.videoVr) {
      thumbnailStyle.backgroundSize = this.imageWidth + 'px ' + this.imageHeight + 'px';
      thumbnailStyle.backgroundPosition = this.positionX + 'px ' + this.positionY + 'px';
    }

    if (this.props.isCarousel) {
      thumbnail = (
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
          imageWidth={this.imageWidth}
          setBgPositionVr={this.setBgPositionVr}
          thumbnailCarouselWidth={this.thumbnailCarouselWidth}
          thumbnailCarouselHeight={this.thumbnailCarouselHeight}
          centralThumbnail={thumbnails}
          thumbnailStyle={thumbnailStyle}
        />
      );
    } else {
      thumbnail = (
        <Thumbnail
          onRef={this.onRef}
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
          thumbnailStyle={thumbnailStyle}
        />
      );
    }

    return <div className="oo-scrubber-thumbnail-wrapper">{thumbnail}</div>;
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
  vrViewingDirection: PropTypes.shape({
    yaw: PropTypes.number,
    roll: PropTypes.number,
    pitch: PropTypes.number
  }),
  thumbnails: PropTypes.object,
  hoverPosition: PropTypes.number,
  hoverTime: PropTypes.number,
  duration: PropTypes.number,
  scrubberBarWidth: PropTypes.number,
  isCarousel: PropTypes.bool,
  videoVr: PropTypes.bool,
  fullscreen: PropTypes.bool
};

module.exports = ThumbnailContainer;
