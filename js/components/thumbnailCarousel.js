/**
 * ThumbnailCarousel component
 *
 * @module ThumbnailCarousel
 */

var React = require('react'),
    ReactDOM = require('react-dom'),
    Utils = require('./utils');

var ThumbnailCarousel = React.createClass({
  getInitialState: function() {
    this.positionY = 0;
    this.positionX = -320;
    this.imageWidth = 0;
    this.imageHeight = 0;
    this.thumbnailWidth = 0;
    this.thumbnailHeight = 0;
    return {
      thumbnailWidth: 0,
      thumbnailHeight: 0,
      centerThumbnailWidth: 0,
      centerThumbnailHeight: 0,
      thumbnailPadding: 6
    };
  },

  componentDidMount: function() {
    var thumbnail = ReactDOM.findDOMNode(this.refs.thumbnail);
    var carousel = ReactDOM.findDOMNode(this.refs.thumbnailCarousel);
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
      var newThumbnailWidth = ReactDOM.findDOMNode(this.refs.thumbnailCarousel).clientWidth;
      var newThumbnailHeight = ReactDOM.findDOMNode(this.refs.thumbnailCarousel).clientHeight;
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
    var thumbnailWidth = ReactDOM.findDOMNode(this.refs.thumbnailCarousel).clientWidth;
    var thumbnailHeight = ReactDOM.findDOMNode(this.refs.thumbnailCarousel).clientHeight;
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
        if (imageWidth > 380) {
          imageWidth = 380;
          imageHeight = thumbnail.imageHeight * 380 / thumbnail.imageWidth;
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

  findThumbnailsAfter: function(data) {
    console.log('BBB data', data);
    var start = (data.scrubberBarWidth + data.centerWidth) / 2;
    var thumbnailsAfter = [];
    for (var i = data.pos + 1, j = 0; i < data.timeSlices.length; i++, j++) {
      var left = start + data.padding + j * (data.imgWidth + data.padding);
      if (left + data.imgWidth <= data.scrubberBarWidth) {
        var thumbStyle = {
          left: left,
          top: data.top
        };
        var thumbUrl = data.thumbnails.data.thumbnails[data.timeSlices[i]][data.width].url;
        if (Utils.isValidString(thumbUrl)) {
          thumbStyle.backgroundImage = "url('" + thumbUrl + "')";
        }
        thumbnailsAfter.push(<div className="oo-thumbnail-carousel-image" key={i} ref="thumbnail" style={thumbStyle}></div>);
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
        var thumbStyle = {
          left: left,
          top: data.top
        };
        var thumbUrl = data.thumbnails.data.thumbnails[data.timeSlices[i]][data.width].url;
        if (Utils.isValidString(thumbUrl)) {
          thumbStyle.backgroundImage = "url('" + thumbUrl + "')";
        }
        thumbnailsBefore.push(<div className="oo-thumbnail-carousel-image" key={i} ref="thumbnail" style={thumbStyle}></div>);
      }
    }
    return thumbnailsBefore;
  },

  render: function() {
    var centralThumbnail = Utils.findThumbnail(this.props.thumbnails, this.props.hoverTime, this.props.duration, this.props.videoVr);
    var data = {
      thumbnails: this.props.thumbnails,
      timeSlices: this.props.thumbnails.data.available_time_slices,
      width: this.props.thumbnails.data.available_widths[0],
      imgWidth: this.state.thumbnailWidth,
      centerWidth: this.state.centerThumbnailWidth,
      scrubberBarWidth: this.props.scrubberBarWidth,
      top: this.state.centerThumbnailHeight - this.state.thumbnailHeight,
      pos: centralThumbnail.pos,
      padding: this.state.thumbnailPadding
    };

    var thumbnailsBefore = this.findThumbnailsBefore(data);
    var thumbnailsAfter = this.findThumbnailsAfter(data);
    var thumbnailClassName = "oo-thumbnail-carousel-center-image";
    var thumbnailStyle = {
      left: (data.scrubberBarWidth - data.centerWidth) / 2
    };
    if (Utils.isValidString(centralThumbnail.url)) {
      thumbnailStyle.backgroundImage = "url('" + centralThumbnail.url + "')";
    }

    if (this.props.videoVr) {
      thumbnailStyle.backgroundSize = this.imageWidth + "px " + this.imageHeight + "px";
      thumbnailStyle.backgroundPosition = this.positionX + "px " + this.positionY + "px";
      thumbnailStyle.repeat = "repeat no-repeat";
      thumbnailClassName += " oo-thumbnail-vr";
    }

    var time = isFinite(parseInt(this.props.hoverTime)) ? Utils.formatSeconds(parseInt(this.props.hoverTime)) : null;

    console.log('BBB thumbnailStyle', thumbnailStyle);
    return (
      <div className="oo-scrubber-carousel-container">
        {thumbnailsBefore}
        <div className={thumbnailClassName} ref="thumbnailCarousel" style={thumbnailStyle}>
          <div className="oo-thumbnail-carousel-time">{time}</div>
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
  scrubberBarWidth: 0
};

module.exports = ThumbnailCarousel;