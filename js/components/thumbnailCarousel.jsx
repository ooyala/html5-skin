import React from 'react';
import PropTypes from 'prop-types';
import Utils from './utils';
import CONSTANTS from '../constants/constants';
/**
 * ThumbnailCarousel component
 */
class ThumbnailCarousel extends React.Component {
  state = {
    thumbnailWidth: 0,
    thumbnailHeight: 0,
    centerThumbnailWidth: 0,
    centerThumbnailHeight: 0,
    thumbnailPadding: 6,
  };

  carouselPositionX = 0;

  carouselPositionY = 0;

  centerThumbnail = null;

  thumbnail = null;

  componentDidMount() {
    const {
      onRef,
      thumbnailWidth,
      thumbnailHeight,
      thumbnailCarouselWidth,
      thumbnailCarouselHeight,
    } = this.props;
    onRef(this);

    const { centerThumbnail, thumbnail } = this;
    let thumbnailStylePadding = thumbnail
      ? window.getComputedStyle(thumbnail, null).getPropertyValue('padding')
      : 0;
    thumbnailStylePadding = parseFloat(thumbnailStylePadding); // convert css px to number
    const { thumbnailPadding } = this.state;
    const thumbnailPaddingSanitized = !Number.isNaN(thumbnailStylePadding)
      ? thumbnailStylePadding
      : thumbnailPadding;

    if (!thumbnail || !centerThumbnail) {
      return;
    }
    if (thumbnail.clientWidth && centerThumbnail.clientWidth) {
      this.setState({
        thumbnailWidth: thumbnail.clientWidth,
        thumbnailHeight: thumbnail.clientHeight,
        centerThumbnailWidth: centerThumbnail.clientWidth,
        centerThumbnailHeight: centerThumbnail.clientHeight,
        thumbnailPadding: thumbnailPaddingSanitized,
      });
      return;
    }
    const thumbnailStyleWidth = Number.parseFloat(
      window.getComputedStyle(thumbnail, null).getPropertyValue('width')
    ); // convert css px to number
    const thumbnailWidthSanitized = !Number.isNaN(thumbnailStyleWidth)
      ? thumbnailStyleWidth
      : Number.parseInt(thumbnailWidth, 0);

    const thumbnailStyleHeight = Number.parseFloat(
      window.getComputedStyle(thumbnail, null).getPropertyValue('height')
    ); // convert css px to number

    const thumbnailHeightSanitized = !Number.isNaN(thumbnailStyleHeight)
      ? thumbnailStyleHeight
      : parseInt(thumbnailHeight, 0);

    const carouselStyleWidth = Number.parseFloat(
      window.getComputedStyle(centerThumbnail, null).getPropertyValue('width'),
    ); // convert css px to number
    const carouselWidth = !Number.isNaN(carouselStyleWidth)
      ? carouselStyleWidth
      : Number.parseInt(thumbnailCarouselWidth, 0);

    const carouselStyleHeight = Number.parseFloat(
      window.getComputedStyle(centerThumbnail, null).getPropertyValue('height')
    ); // convert css px to number
    const carouselHeight = !Number.isNaN(carouselStyleHeight)
      ? carouselStyleHeight
      : Number.parseInt(thumbnailCarouselHeight, 0);

    this.setState({
      thumbnailWidth: thumbnailWidthSanitized,
      thumbnailHeight: thumbnailHeightSanitized,
      centerThumbnailWidth: carouselWidth,
      centerThumbnailHeight: carouselHeight,
      thumbnailPadding: thumbnailPaddingSanitized,
    });
  }

  componentWillUnmount() {
    const { onRef } = this.props;
    onRef(undefined);
  }

  /**
   * @description get styles for carousel thumbnails
   * @param {object} thumbs - carousel thumbnails
   * @param {number} width - carousel width
   * @returns {object} object with values for bg url and bg size, position and repeat for vr video
   */
  getThumbnailsCarouselStyles(thumbs, width) {
    const thumbStyle = {};
    let thumb = thumbs[width];
    const {
      setBgPositionVr,
      thumbnailCarouselHeight,
      thumbnailCarouselWidth,
      videoVr,
      vrViewingDirection,
    } = this.props;
    if (videoVr) {
      const widthVr = CONSTANTS.THUMBNAIL.THUMBNAIL_CAROUSEL_VR_RATIO * width;
      if (
        thumbs[widthVr] !== undefined
        && thumbs[widthVr].width !== undefined
        && thumbs[widthVr].width < CONSTANTS.THUMBNAIL.MAX_VR_THUMBNAIL_CAROUSEL_BG_WIDTH
      ) {
        thumb = thumbs[widthVr];
      }
    }
    const thumbUrl = thumb.url;
    if (Utils.isValidString(thumbUrl)) {
      thumbStyle.backgroundImage = `url('${thumbUrl}')`;
    }

    if (videoVr) {
      const bgWidth = thumb.width;
      const bgHeight = thumb.height;
      const carouselParams = {
        yaw: vrViewingDirection.yaw,
        pitch: vrViewingDirection.pitch,
        imageWidth: bgWidth,
        imageHeight: bgHeight,
        thumbnailWidth: thumbnailCarouselWidth,
        thumbnailHeight: thumbnailCarouselHeight,
      };
      const carouselBgPositions = setBgPositionVr(carouselParams);
      if (carouselBgPositions) {
        this.carouselPositionX = carouselBgPositions.positionX;
        this.carouselPositionY = carouselBgPositions.positionY;
      }

      thumbStyle.backgroundRepeat = 'repeat no-repeat';
      thumbStyle.backgroundSize = `${bgWidth}px ${bgHeight}px`;
      thumbStyle.backgroundPosition = `${this.carouselPositionX}px ${this.carouselPositionY}px`;
    }
    return thumbStyle;
  }

  /**
   * Find thumbnails following after specified
   * @param {Object} data - the specific data object to iterate through
   * @returns {Array} the array of DOM elements with thumbs
   */
  findThumbnailsAfter = (data) => {
    const start = (data.scrubberBarWidth + data.centerWidth) / 2;
    const thumbnailsAfter = [];
    for (
      let position = data.pos + 1, index = 0;
      position < data.timeSlices.length;
      position += 1, index += 1
    ) {
      const left = start + data.padding + index * (data.imgWidth + data.padding);
      if (left + data.imgWidth <= data.scrubberBarWidth) {
        const { width } = data;
        const thumbs = data.thumbnails.data.thumbnails[data.timeSlices[position]];
        const thumbStyle = this.getThumbnailsCarouselStyles(thumbs, width);
        thumbStyle.left = left;
        thumbStyle.top = data.top;
        thumbnailsAfter.push(
          <div
            className="oo-thumbnail-carousel-image"
            key={position}
            ref={(node) => { this.thumbnail = node; }}
            style={thumbStyle}
          />
        );
      }
    }
    return thumbnailsAfter;
  }

  /**
   * Find thumbnails going before specified
   * @param {Object} data - the specific data object to iterate through
   * @returns {Array} the array of DOM elements with thumbs
   */
  findThumbnailsBefore = (data) => {
    const start = (data.scrubberBarWidth - data.centerWidth) / 2;

    const thumbnailsBefore = [];
    for (let position = data.pos - 1, index = 0; position >= 0; position -= 1, index += 1) {
      const left = start - (index + 1) * (data.imgWidth + data.padding);
      if (left >= 0) {
        const { width } = data;
        const thumbs = data.thumbnails.data.thumbnails[data.timeSlices[position]];
        const thumbStyle = this.getThumbnailsCarouselStyles(thumbs, width);
        thumbStyle.left = left;
        thumbStyle.top = data.top;
        thumbnailsBefore.push(
          <div
            className="oo-thumbnail-carousel-image"
            key={position}
            ref={(node) => { this.thumbnail = node; }}
            style={thumbStyle}
          />
        );
      }
    }
    return thumbnailsBefore;
  }

  render() {
    const {
      centralThumbnail,
      scrubberBarWidth,
      thumbnails,
      thumbnailStyle,
      videoVr,
      time,
    } = this.props;
    const {
      centerThumbnailWidth,
      thumbnailHeight,
      thumbnailPadding,
      thumbnailWidth,
      centerThumbnailHeight,
    } = this.state;
    const data = {
      thumbnails,
      timeSlices: thumbnails.data.available_time_slices,
      width: thumbnails.data.available_widths[0],
      imgWidth: thumbnailWidth,
      centerWidth: centerThumbnailWidth,
      scrubberBarWidth,
      top: centerThumbnailHeight - thumbnailHeight,
      pos: centralThumbnail.pos,
      padding: thumbnailPadding,
    };

    const thumbnailsBefore = this.findThumbnailsBefore(data);
    const thumbnailsAfter = this.findThumbnailsAfter(data);
    let thumbnailClassName = 'oo-thumbnail-carousel-center-image';

    if (videoVr) {
      thumbnailClassName += ' oo-thumbnail-vr';
    }

    const thumbnailStyleSanitized = {};
    if (thumbnailStyle !== null && typeof thumbnailStyle === 'object') {
      Object.assign(thumbnailStyleSanitized, thumbnailStyle);
    }
    thumbnailStyleSanitized.left = (data.scrubberBarWidth - data.centerWidth) / 2;

    return (
      <div className="oo-scrubber-carousel-container">
        {thumbnailsBefore}
        <div
          className={thumbnailClassName}
          ref={(node) => { this.centerThumbnail = node; }}
          style={thumbnailStyleSanitized}
          data-testid="centerThumbnail"
        >
          <div className="oo-thumbnail-carousel-time">{time}</div>
        </div>
        {thumbnailsAfter}
      </div>
    );
  }
}

ThumbnailCarousel.propTypes = {
  onRef: PropTypes.func,
  time: PropTypes.string,
  thumbnails: PropTypes.shape({}),
  centralThumbnail: PropTypes.shape({}),
  thumbnailStyle: PropTypes.shape({}),
  scrubberBarWidth: PropTypes.number,
  vrViewingDirection: PropTypes.shape({
    yaw: PropTypes.number,
    roll: PropTypes.number,
    pitch: PropTypes.number,
  }),
  videoVr: PropTypes.bool,
  setBgPositionVr: PropTypes.func,
  thumbnailCarouselWidth: PropTypes.number,
  thumbnailCarouselHeight: PropTypes.number,
  thumbnailWidth: PropTypes.number,
  thumbnailHeight: PropTypes.number,
};

ThumbnailCarousel.defaultProps = {
  onRef: () => {},
  time: '',
  thumbnails: {},
  centralThumbnail: {},
  thumbnailStyle: {},
  setBgPositionVr: () => {},
  scrubberBarWidth: 0,
  thumbnailCarouselWidth: 0,
  thumbnailCarouselHeight: 0,
  vrViewingDirection: { yaw: 0, roll: 0, pitch: 0 },
  videoVr: false,
  thumbnailWidth: 0,
  thumbnailHeight: 0,
};

module.exports = ThumbnailCarousel;
