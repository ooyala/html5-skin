import React from 'react';
import PropTypes from 'prop-types';
import Utils from './utils';
import CONSTANTS from '../constants/constants';
import Thumbnail from './thumbnail';
import ThumbnailCarousel from './thumbnailCarousel';

/**
 * Thumbnail component
 */
class ThumbnailContainer extends React.Component {
  constructor(props) {
    super(props);
    this.child = null;
    this.positionY = 0;
    this.positionX = 0;
    this.imageWidth = 0;
    this.imageHeight = 0;
    this.thumbnailWidth = 0;
    this.thumbnailHeight = 0;
    this.thumbnailCarouselWidth = 0;
    this.thumbnailCarouselHeight = 0;
  }

  componentDidMount() {
    const { videoVr, vrViewingDirection } = this.props;
    if (!videoVr) {
      return;
    }
    this.setThumbnailSizesVr();
    this.setImageSizes();
    const { yaw, pitch } = vrViewingDirection;
    const params = {
      yaw,
      pitch,
      imageWidth: this.imageWidth,
      imageHeight: this.imageHeight,
      thumbnailWidth: this.thumbnailWidth,
      thumbnailHeight: this.thumbnailHeight,
    };
    const positions = this.setBgPositionVr(params);
    if (positions) {
      this.positionX = positions.positionX;
      this.positionY = positions.positionY;
    }
  }

  /**
   * For VR viewing mode track if vr direction changed
   * @param {Object} nextProps - react next props
   */
  componentWillReceiveProps(nextProps) {
    const { videoVr, vrViewingDirection } = this.props;
    if (vrViewingDirection === nextProps.vrViewingDirection || !videoVr) {
      return;
    }
    const { yaw, pitch } = nextProps.vrViewingDirection;
    const params = {
      yaw,
      pitch,
      imageWidth: this.imageWidth,
      imageHeight: this.imageHeight,
      thumbnailWidth: this.thumbnailWidth,
      thumbnailHeight: this.thumbnailHeight,
    };
    const positions = this.setBgPositionVr(params);
    if (positions) {
      this.positionX = positions.positionX;
      this.positionY = positions.positionY;
    }
  }

  /**
   * For VR mode update the position
   */
  componentDidUpdate() {
    const { videoVr } = this.props;
    if (!videoVr || this.child == null || typeof this.child !== 'object') {
      return;
    }
    if (this.child.refs && this.child.refs.thumbnail) {
      const newThumbnailWidth = Utils.getClientWidth(this.child.refs.thumbnail);
      const newThumbnailHeight = Utils.getClientHeight(this.child.refs.thumbnail);
      if (newThumbnailWidth !== this.thumbnailWidth || newThumbnailHeight !== this.thumbnailHeight) {
        this.thumbnailWidth = newThumbnailWidth;
        this.thumbnailHeight = newThumbnailHeight;
        const { vrViewingDirection } = this.props;
        const { yaw, pitch } = vrViewingDirection;
        const params = {
          yaw,
          pitch,
          imageWidth: this.imageWidth,
          imageHeight: this.imageHeight,
          thumbnailWidth: this.thumbnailWidth,
          thumbnailHeight: this.thumbnailHeight,
        };
        const positions = this.setBgPositionVr(params);
        if (positions) {
          this.positionX = positions.positionX;
          this.positionY = positions.positionY;
        }
      }
    }
    const { isCarousel } = this.props;
    if (!isCarousel || !this.child.refs || !this.child.refs.thumbnailCarousel) {
      return;
    }
    const newThumbnailCarouselWidth = Utils.getClientWidth(this.child.refs.thumbnailCarousel);
    const newThumbnailCarouselHeight = Utils.getClientHeight(this.child.refs.thumbnailCarousel);
    if (newThumbnailCarouselWidth !== this.thumbnailCarouselWidth) {
      this.thumbnailCarouselWidth = newThumbnailCarouselWidth;
    }
    if (newThumbnailCarouselHeight !== this.thumbnailCarouselHeight) {
      this.thumbnailCarouselHeight = newThumbnailCarouselHeight;
    }
  }

  /**
   * assign DOM object to a this.child once appeared
   * @param {Object} ref - the DOM object reference
   */
  onRef = (ref) => {
    this.child = ref;
  }

  /**
   * set up thumbnail sizes
   */
  setThumbnailSizesVr = () => {
    if (this.child == null || typeof this.child !== 'object') {
      return;
    }
    this.setThumbnailSize('thumbnail', 'thumbnailWidth', 'thumbnailHeight');
    const { isCarousel } = this.props;
    if (isCarousel) {
      this.setThumbnailSize('thumbnailCarousel', 'thumbnailCarouselWidth', 'thumbnailCarouselHeight');
    }
  }

  /**
   * @description set values for thumbnails sizes
   * @private
   * @param {string} refName - name of thumbnail container ref
   * @param {string} widthName - name for width which is associated with the ref
   * @param {string} heightName - name for height which is associated with the ref
   */
  setThumbnailSize = (refName, widthName, heightName) => {
    if (!this.child.refs || !this.child.refs[refName]) {
      return;
    }
    const width = Utils.getClientWidth(this.child.refs[refName]);
    const height = Utils.getClientHeight(this.child.refs[refName]);
    if (width) {
      this[widthName] = width;
    }
    if (height) {
      this[heightName] = height;
    }
  }

  setImageSizes = () => {
    const {
      duration,
      hoverTime,
      thumbnails,
      videoVr,
    } = this.props;
    const thumbnail = Utils.findThumbnail(thumbnails, hoverTime, duration, videoVr);
    if (thumbnail == null || typeof thumbnail !== 'object') {
      return;
    }
    let { imageWidth, imageHeight } = thumbnail;
    if (!imageWidth || !imageHeight) {
      return;
    }
    if (imageWidth > CONSTANTS.THUMBNAIL.MAX_VR_THUMBNAIL_BG_WIDTH) {
      imageWidth = CONSTANTS.THUMBNAIL.MAX_VR_THUMBNAIL_BG_WIDTH;
      imageHeight = imageHeight * CONSTANTS.THUMBNAIL.MAX_VR_THUMBNAIL_BG_WIDTH / imageWidth;
    }
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
  }

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
  setBgPositionVr = (params) => {
    if (!params) {
      return null;
    }
    let yaw = Utils.ensureNumber(params.yaw, 0);
    let pitch = Utils.ensureNumber(params.pitch, 0);
    const imageWidth = Utils.ensureNumber(params.imageWidth, 0);
    const imageHeight = Utils.ensureNumber(params.imageHeight, 0);
    const thumbnailWidth = Utils.ensureNumber(params.thumbnailWidth, 0); // this.thumbnailWidth;
    const thumbnailHeight = Utils.ensureNumber(params.thumbnailHeight, 0); // this.thumbnailHeight;
    yaw = this.getCurrentYawVr(yaw);
    pitch = pitch >= 360 ? 0 : pitch;

    let positionY = -((imageHeight - thumbnailHeight) / 2 - pitch);
    const bottomCoordinate = -(imageHeight - thumbnailHeight);
    if (positionY > 0) {
      positionY = 0;
    } else if (positionY < bottomCoordinate) {
      positionY = bottomCoordinate;
    }
    const positionX = -(imageWidth - thumbnailWidth / 2 - imageWidth * yaw / 360);
    return { positionX, positionY };
  }

  /**
   * @description return current coefficient of the yaw if yaw > 360 or yaw < -360 degrees
   * @param {Number} yaw - angle in degrees
   * @private
   * @returns {number} coefficient showing how many times to take 360 degrees
   */
  getCurrentYawVr = (yaw) => {
    const direction = yaw <= -360 ? -1 : 1;
    const ratio = Math.floor(direction * yaw / 360);
    const coef = yaw - direction * ratio * 360;
    return coef;
  }

  render() {
    const {
      duration,
      fullscreen,
      hoverPosition,
      hoverTime,
      isCarousel,
      scrubberBarWidth,
      thumbnails,
      videoVr,
      vrViewingDirection,
    } = this.props;
    const time = Number.isFinite(Number.parseInt(hoverTime, 0))
      ? Utils.formatSeconds(Number.parseInt(hoverTime, 0))
      : null;
    let thumbnail = null;

    const centralThumbnail = Utils.findThumbnail(
      thumbnails,
      hoverTime,
      duration,
      videoVr
    );
    const thumbnailStyle = {};
    thumbnailStyle.left = hoverPosition;
    if (Utils.isValidString(centralThumbnail.url)) {
      thumbnailStyle.backgroundImage = `url('${centralThumbnail.url}')`;
    }

    if (videoVr) {
      thumbnailStyle.backgroundSize = `${this.imageWidth}px ${this.imageHeight}px`;
      thumbnailStyle.backgroundPosition = `${this.positionX}px ${this.positionY}px`;
    }

    if (isCarousel) {
      thumbnail = (
        <ThumbnailCarousel
          onRef={this.onRef}
          time={time}
          thumbnails={thumbnails}
          duration={duration}
          hoverTime={hoverTime}
          scrubberBarWidth={scrubberBarWidth}
          hoverPosition={hoverPosition}
          vrViewingDirection={vrViewingDirection}
          videoVr={videoVr}
          fullscreen={fullscreen}
          imageWidth={this.imageWidth}
          setBgPositionVr={this.setBgPositionVr}
          thumbnailCarouselWidth={this.thumbnailCarouselWidth}
          thumbnailCarouselHeight={this.thumbnailCarouselHeight}
          centralThumbnail={centralThumbnail}
          thumbnailStyle={thumbnailStyle}
        />
      );
    } else {
      thumbnail = (
        <Thumbnail
          onRef={this.onRef}
          time={time}
          thumbnails={thumbnails}
          hoverPosition={hoverPosition}
          duration={duration}
          hoverTime={hoverTime}
          vrViewingDirection={vrViewingDirection}
          videoVr={videoVr}
          fullscreen={fullscreen}
          positionY={this.positionY}
          positionX={this.positionX}
          imageWidth={this.imageWidth}
          thumbnailStyle={thumbnailStyle}
        />
      );
    }

    return <div className="oo-scrubber-thumbnail-wrapper">{thumbnail}</div>;
  }
}

ThumbnailContainer.defaultProps = {
  isCarousel: false,
  thumbnails: {},
  hoverPosition: 0,
  duration: 0,
  hoverTime: 0,
  vrViewingDirection: { yaw: 0, roll: 0, pitch: 0 },
  videoVr: false,
  fullscreen: false,
  scrubberBarWidth: 0,
};

ThumbnailContainer.propTypes = {
  vrViewingDirection: PropTypes.shape({
    yaw: PropTypes.number,
    roll: PropTypes.number,
    pitch: PropTypes.number,
  }),
  thumbnails: PropTypes.shape({}),
  hoverPosition: PropTypes.number,
  hoverTime: PropTypes.number,
  duration: PropTypes.number,
  scrubberBarWidth: PropTypes.number,
  isCarousel: PropTypes.bool,
  videoVr: PropTypes.bool,
  fullscreen: PropTypes.bool,
};

module.exports = ThumbnailContainer;
