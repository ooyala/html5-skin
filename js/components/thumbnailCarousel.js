/**
 * ThumbnailCarousel component
 *
 * @module ThumbnailCarousel
 */

var React = require('react'),
    ReactDOM = require('react-dom'),
    CONSTANTS = require('../constants/constants'),
    Utils = require('./utils');

var ThumbnailCarousel = React.createClass({
  getInitialState: function() {
    this.carouselPositionX = 0;
    this.carouselPositionY = 0;
    return {
      thumbnailWidth: 0,
      thumbnailHeight: 0,
      centerThumbnailWidth: 0,
      centerThumbnailHeight: 0,
      thumbnailPadding: 6
    };
  },

  componentDidMount: function() {
    this.props.onRef(this);

    var thumbnail = ReactDOM.findDOMNode(this.refs.thumbnailCarousel);
    var carousel = ReactDOM.findDOMNode(this.refs.thumbnail);
    var thumbnailStylePadding = thumbnail ? window.getComputedStyle(thumbnail, null).getPropertyValue("padding") : 0;
    thumbnailStylePadding = parseFloat(thumbnailStylePadding); // convert css px to number
    var thumbnailPadding = !isNaN(thumbnailStylePadding) ? thumbnailStylePadding : this.state.thumbnailPadding;

    if (thumbnail && carousel) {
      if (thumbnail.clientWidth && carousel.clientWidth) {
        this.setState({
          thumbnailWidth: thumbnail.clientWidth,
          thumbnailHeight: thumbnail.clientHeight,
          centerThumbnailWidth: carousel.clientWidth,
          centerThumbnailHeight: carousel.clientHeight,
          thumbnailPadding: thumbnailPadding
        });
      } else {
        var thumbnailStyleWidth = thumbnail ? window.getComputedStyle(thumbnail, null).getPropertyValue("width") : 0;
        thumbnailStyleWidth = parseFloat(thumbnailStyleWidth); // convert css px to number
        var thumbnailWidth = !isNaN(thumbnailStyleWidth) ? thumbnailStyleWidth : parseInt(this.props.thumbnailWidth);

        var thumbnailStyleHeight = thumbnail ? window.getComputedStyle(thumbnail, null).getPropertyValue("height") : 0;
        thumbnailStyleHeight = parseFloat(thumbnailStyleHeight); // convert css px to number
        var thumbnailHeight = !isNaN(thumbnailStyleHeight) ? thumbnailStyleHeight : parseInt(this.props.thumbnailHeight);

        var carouselStyleWidth = carousel ? window.getComputedStyle(carousel, null).getPropertyValue("width") : 0;
        carouselStyleWidth = parseFloat(carouselStyleWidth); // convert css px to number
        var carouselWidth = !isNaN(carouselStyleWidth) ? carouselStyleWidth : parseInt(this.props.carouselWidth);

        var carouselStyleHeight = carousel ? window.getComputedStyle(carousel, null).getPropertyValue("height") : 0;
        carouselStyleHeight = parseFloat(carouselStyleHeight); // convert css px to number
        var carouselHeight = !isNaN(carouselStyleHeight) ? carouselStyleHeight : parseInt(this.props.carouselHeight);

        this.setState({
          thumbnailWidth: thumbnailWidth,
          thumbnailHeight: thumbnailHeight,
          centerThumbnailWidth: carouselWidth,
          centerThumbnailHeight: carouselHeight,
          thumbnailPadding: thumbnailPadding
        });
      }
    }
  },

  componentWillUnmount: function() {
    this.props.onRef(undefined);
  },

  findThumbnailsAfter: function(data) {
    var start = (data.scrubberBarWidth + data.centerWidth) / 2;
    var thumbnailsAfter = [];
    for (var i = data.pos + 1, j = 0; i < data.timeSlices.length; i++, j++) {
      var left = start + data.padding + j * (data.imgWidth + data.padding);
      if (left + data.imgWidth <= data.scrubberBarWidth) {
        var width = data.width;
        var thumbs = data.thumbnails.data.thumbnails[data.timeSlices[i]];
        var thumbStyle = this.getThumbnailsCarouselStyles(thumbs, width);
        thumbStyle.left = left;
        thumbStyle.top = data.top;
        thumbnailsAfter.push(<div className="oo-thumbnail-carousel-image" key={i} ref="thumbnailCarousel" style={thumbStyle}></div>);
      }
    }
    return thumbnailsAfter;
  },

  findThumbnailsBefore: function(data) {
    var start = (data.scrubberBarWidth - data.centerWidth) / 2;

    var thumbnailsBefore = [];
    for (var i = data.pos - 1, j = 0; i >= 0; i--, j++) {
      var left = start - (j + 1) * (data.imgWidth + data.padding);
      if (left >= 0) {
        var width = data.width;
        var thumbs = data.thumbnails.data.thumbnails[data.timeSlices[i]];
        var thumbStyle = this.getThumbnailsCarouselStyles(thumbs, width);
        thumbStyle.left = left;
        thumbStyle.top = data.top;
        thumbnailsBefore.push(<div className="oo-thumbnail-carousel-image" key={i} ref="thumbnailCarousel" style={thumbStyle}></div>);
      }
    }
    return thumbnailsBefore;
  },

  /**
   * @description get styles for carousel thumbnails
   * @param thumbs
   * @param width
   * @returns {object} object with values for bg url and bg size, position and repeat for vr video
   */
  getThumbnailsCarouselStyles: function(thumbs, width) {
    var thumbStyle = {};
    var thumb = thumbs[width];
    if (this.props.videoVr) {
      var widthVr = CONSTANTS.THUMBNAIL.THUMBNAIL_CAROUSEL_VR_RATIO * width;
      if (thumbs[widthVr] !== undefined &&
        thumbs[widthVr].width !== undefined &&
        thumbs[widthVr].width < CONSTANTS.THUMBNAIL.MAX_VR_THUMBNAIL_CAROUSEL_BG_WIDTH) {
        thumb = thumbs[widthVr];
      }
    }
    var thumbUrl = thumb.url;
    if (Utils.isValidString(thumbUrl)) {
      thumbStyle.backgroundImage = "url('" + thumbUrl + "')";
    }

    if (this.props.videoVr) {
      var bgWidth = thumb.width;
      var bgHeight = thumb.height;
      var carouselParams = {
        yaw: this.props.vrViewingDirection.yaw,
        pitch: this.props.vrViewingDirection.pitch,
        imageWidth: bgWidth,
        imageHeight: bgHeight,
        thumbnailWidth: this.props.thumbnailCarouselWidth,
        thumbnailHeight: this.props.thumbnailCarouselHeight
      };
      var carouselBgPositions = this.props.setBgPositionVr(carouselParams);
      if (carouselBgPositions) {
        this.carouselPositionX = carouselBgPositions.positionX;
        this.carouselPositionY = carouselBgPositions.positionY;
      }

      thumbStyle.backgroundRepeat = "repeat no-repeat";
      thumbStyle.backgroundSize = bgWidth + "px " + bgHeight + "px";
      thumbStyle.backgroundPosition = this.carouselPositionX + "px " + this.carouselPositionY + "px";
    }
    return thumbStyle;
  },

  render: function() {
    var data = {
      thumbnails: this.props.thumbnails,
      timeSlices: this.props.thumbnails.data.available_time_slices,
      width: this.props.thumbnails.data.available_widths[0],
      imgWidth: this.state.thumbnailWidth,
      centerWidth: this.state.centerThumbnailWidth,
      scrubberBarWidth: this.props.scrubberBarWidth,
      top: this.state.centerThumbnailHeight - this.state.thumbnailHeight,
      pos: this.props.centralThumbnail.pos,
      padding: this.state.thumbnailPadding
    };

    var thumbnailsBefore = this.findThumbnailsBefore(data);
    var thumbnailsAfter = this.findThumbnailsAfter(data);
    var thumbnailClassName = "oo-thumbnail-carousel-center-image";

    if (this.props.videoVr) {
      thumbnailClassName += " oo-thumbnail-vr";
    }

    var thumbnailStyle = this.props.thumbnailStyle;
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
  }
});

ThumbnailCarousel.defaultProps = {
  thumbnails: {},
  duration: 0,
  hoverTime: 0,
  scrubberBarWidth: 0,
  vrViewingDirection: { yaw: 0, roll: 0, pitch: 0 },
  videoVr: false,
  fullscreen: false,
  imageWidth: 0
};

ThumbnailCarousel.propTypes = {
  onRef: React.PropTypes.func,
  time: React.PropTypes.string,
  thumbnails: React.PropTypes.object,
  centralThumbnail: React.PropTypes.object,
  duration: React.PropTypes.number,
  hoverTime: React.PropTypes.number,
  scrubberBarWidth: React.PropTypes.number,
  hoverPosition: React.PropTypes.number,
  vrViewingDirection: React.PropTypes.shape({
    yaw: React.PropTypes.number,
    roll: React.PropTypes.number,
    pitch: React.PropTypes.number
  }),
  videoVr: React.PropTypes.bool,
  fullscreen: React.PropTypes.bool,
  imageWidth: React.PropTypes.number,
  setBgPositionVr: React.PropTypes.func,
  thumbnailCarouselWidth: React.PropTypes.number,
  thumbnailCarouselHeight: React.PropTypes.number
};

module.exports = ThumbnailCarousel;