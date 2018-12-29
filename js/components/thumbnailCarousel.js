/**
 * ThumbnailCarousel component
 *
 * @module ThumbnailCarousel
 */

const React = require('react');

const ReactDOM = require('react-dom');


const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const _ = require('underscore');
const Utils = require('./utils');
const CONSTANTS = require('../constants/constants');

const ThumbnailCarousel = createReactClass({
  getInitialState() {
    this.carouselPositionX = 0;
    this.carouselPositionY = 0;
    return {
      thumbnailWidth: 0,
      thumbnailHeight: 0,
      centerThumbnailWidth: 0,
      centerThumbnailHeight: 0,
      thumbnailPadding: 6,
    };
  },

  componentDidMount() {
    this.props.onRef(this);

    const thumbnail = ReactDOM.findDOMNode(this.refs.thumbnailCarousel);
    const carousel = ReactDOM.findDOMNode(this.refs.thumbnail);
    let thumbnailStylePadding = thumbnail
      ? window.getComputedStyle(thumbnail, null).getPropertyValue('padding')
      : 0;
    thumbnailStylePadding = parseFloat(thumbnailStylePadding); // convert css px to number
    const thumbnailPadding = !isNaN(thumbnailStylePadding)
      ? thumbnailStylePadding
      : this.state.thumbnailPadding;

    if (thumbnail && carousel) {
      if (thumbnail.clientWidth && carousel.clientWidth) {
        this.setState({
          thumbnailWidth: thumbnail.clientWidth,
          thumbnailHeight: thumbnail.clientHeight,
          centerThumbnailWidth: carousel.clientWidth,
          centerThumbnailHeight: carousel.clientHeight,
          thumbnailPadding,
        });
      } else {
        let thumbnailStyleWidth = thumbnail
          ? window.getComputedStyle(thumbnail, null).getPropertyValue('width')
          : 0;
        thumbnailStyleWidth = parseFloat(thumbnailStyleWidth); // convert css px to number
        const thumbnailWidth = !isNaN(thumbnailStyleWidth)
          ? thumbnailStyleWidth
          : parseInt(this.props.thumbnailWidth);

        let thumbnailStyleHeight = thumbnail
          ? window.getComputedStyle(thumbnail, null).getPropertyValue('height')
          : 0;
        thumbnailStyleHeight = parseFloat(thumbnailStyleHeight); // convert css px to number
        const thumbnailHeight = !isNaN(thumbnailStyleHeight)
          ? thumbnailStyleHeight
          : parseInt(this.props.thumbnailHeight);

        let carouselStyleWidth = carousel
          ? window.getComputedStyle(carousel, null).getPropertyValue('width')
          : 0;
        carouselStyleWidth = parseFloat(carouselStyleWidth); // convert css px to number
        const carouselWidth = !isNaN(carouselStyleWidth)
          ? carouselStyleWidth
          : parseInt(this.props.thumbnailCarouselWidth);

        let carouselStyleHeight = carousel
          ? window.getComputedStyle(carousel, null).getPropertyValue('height')
          : 0;
        carouselStyleHeight = parseFloat(carouselStyleHeight); // convert css px to number
        const carouselHeight = !isNaN(carouselStyleHeight)
          ? carouselStyleHeight
          : parseInt(this.props.thumbnailCarouselHeight);

        this.setState({
          thumbnailWidth,
          thumbnailHeight,
          centerThumbnailWidth: carouselWidth,
          centerThumbnailHeight: carouselHeight,
          thumbnailPadding,
        });
      }
    }
  },

  componentWillUnmount() {
    this.props.onRef(undefined);
  },

  findThumbnailsAfter(data) {
    const start = (data.scrubberBarWidth + data.centerWidth) / 2;
    const thumbnailsAfter = [];
    for (let i = data.pos + 1, j = 0; i < data.timeSlices.length; i++, j++) {
      const left = start + data.padding + j * (data.imgWidth + data.padding);
      if (left + data.imgWidth <= data.scrubberBarWidth) {
        const width = data.width;
        const thumbs = data.thumbnails.data.thumbnails[data.timeSlices[i]];
        const thumbStyle = this.getThumbnailsCarouselStyles(thumbs, width);
        thumbStyle.left = left;
        thumbStyle.top = data.top;
        thumbnailsAfter.push(
          <div className="oo-thumbnail-carousel-image" key={i} ref="thumbnailCarousel" style={thumbStyle} />
        );
      }
    }
    return thumbnailsAfter;
  },

  findThumbnailsBefore(data) {
    const start = (data.scrubberBarWidth - data.centerWidth) / 2;

    const thumbnailsBefore = [];
    for (let i = data.pos - 1, j = 0; i >= 0; i--, j++) {
      const left = start - (j + 1) * (data.imgWidth + data.padding);
      if (left >= 0) {
        const width = data.width;
        const thumbs = data.thumbnails.data.thumbnails[data.timeSlices[i]];
        const thumbStyle = this.getThumbnailsCarouselStyles(thumbs, width);
        thumbStyle.left = left;
        thumbStyle.top = data.top;
        thumbnailsBefore.push(
          <div className="oo-thumbnail-carousel-image" key={i} ref="thumbnailCarousel" style={thumbStyle} />
        );
      }
    }
    return thumbnailsBefore;
  },

  /**
   * @description get styles for carousel thumbnails
   * @param {object} thumbs - carousel thumbnails
   * @param {number} width - carousel width
   * @returns {object} object with values for bg url and bg size, position and repeat for vr video
   */
  getThumbnailsCarouselStyles(thumbs, width) {
    const thumbStyle = {};
    let thumb = thumbs[width];
    if (this.props.videoVr) {
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

    if (this.props.videoVr) {
      const bgWidth = thumb.width;
      const bgHeight = thumb.height;
      const carouselParams = {
        yaw: this.props.vrViewingDirection.yaw,
        pitch: this.props.vrViewingDirection.pitch,
        imageWidth: bgWidth,
        imageHeight: bgHeight,
        thumbnailWidth: this.props.thumbnailCarouselWidth,
        thumbnailHeight: this.props.thumbnailCarouselHeight,
      };
      const carouselBgPositions = this.props.setBgPositionVr(carouselParams);
      if (carouselBgPositions) {
        this.carouselPositionX = carouselBgPositions.positionX;
        this.carouselPositionY = carouselBgPositions.positionY;
      }

      thumbStyle.backgroundRepeat = 'repeat no-repeat';
      thumbStyle.backgroundSize = `${bgWidth}px ${bgHeight}px`;
      thumbStyle.backgroundPosition = `${this.carouselPositionX}px ${this.carouselPositionY}px`;
    }
    return thumbStyle;
  },

  render() {
    const data = {
      thumbnails: this.props.thumbnails,
      timeSlices: this.props.thumbnails.data.available_time_slices,
      width: this.props.thumbnails.data.available_widths[0],
      imgWidth: this.state.thumbnailWidth,
      centerWidth: this.state.centerThumbnailWidth,
      scrubberBarWidth: this.props.scrubberBarWidth,
      top: this.state.centerThumbnailHeight - this.state.thumbnailHeight,
      pos: this.props.centralThumbnail.pos,
      padding: this.state.thumbnailPadding,
    };

    const thumbnailsBefore = this.findThumbnailsBefore(data);
    const thumbnailsAfter = this.findThumbnailsAfter(data);
    let thumbnailClassName = 'oo-thumbnail-carousel-center-image';

    if (this.props.videoVr) {
      thumbnailClassName += ' oo-thumbnail-vr';
    }

    const thumbnailStyle = {};
    if (this.props.thumbnailStyle !== null && typeof this.props.thumbnailStyle === 'object') {
      _.extend(thumbnailStyle, this.props.thumbnailStyle);
    }
    thumbnailStyle.left = (data.scrubberBarWidth - data.centerWidth) / 2;

    return (
      <div className="oo-scrubber-carousel-container">
        {thumbnailsBefore}
        <div className={thumbnailClassName} ref="thumbnail" style={thumbnailStyle}>
          <div className="oo-thumbnail-carousel-time">{this.props.time}</div>
        </div>
        {thumbnailsAfter}
      </div>
    );
  },
});

ThumbnailCarousel.defaultProps = {
  thumbnails: {},
  duration: 0,
  hoverTime: 0,
  scrubberBarWidth: 0,
  vrViewingDirection: { yaw: 0, roll: 0, pitch: 0 },
  videoVr: false,
  fullscreen: false,
  imageWidth: 0,
};

ThumbnailCarousel.propTypes = {
  onRef: PropTypes.func,
  time: PropTypes.string,
  thumbnails: PropTypes.object,
  centralThumbnail: PropTypes.object,
  thumbnailStyle: PropTypes.object,
  duration: PropTypes.number,
  hoverTime: PropTypes.number,
  scrubberBarWidth: PropTypes.number,
  hoverPosition: PropTypes.number,
  vrViewingDirection: PropTypes.shape({
    yaw: PropTypes.number,
    roll: PropTypes.number,
    pitch: PropTypes.number,
  }),
  videoVr: PropTypes.bool,
  fullscreen: PropTypes.bool,
  imageWidth: PropTypes.number,
  setBgPositionVr: PropTypes.func,
  thumbnailCarouselWidth: PropTypes.number,
  thumbnailCarouselHeight: PropTypes.number,
};

module.exports = ThumbnailCarousel;
