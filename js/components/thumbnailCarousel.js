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
        var thumbStyle = {
          left: left,
          top: data.top
        };
        var thumbUrl = data.thumbnails.data.thumbnails[data.timeSlices[i]][data.width].url;
        if (Utils.isValidString(thumbUrl)) {
          thumbStyle.backgroundImage = "url('" + thumbUrl + "')";
        }
        thumbnailsBefore.push(<div className="oo-thumbnail-carousel-image" key={i} ref="thumbnailCarousel" style={thumbStyle}></div>);
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
      thumbnailStyle.backgroundSize = this.props.imageWidth + "px " + this.props.imageHeight + "px";
      thumbnailStyle.backgroundPosition = this.props.positionX + "px " + this.props.positionY + "px";
      thumbnailStyle.repeat = "repeat no-repeat";
      thumbnailClassName += " oo-thumbnail-vr";
    }

    var time = isFinite(parseInt(this.props.hoverTime)) ? Utils.formatSeconds(parseInt(this.props.hoverTime)) : null;

    console.log('BBB thumbnailStyle', thumbnailStyle);
    if (this.refs.thumbnail) {
      console.log('BBB this.refs.thumbnail.style', this.refs.thumbnail.style);
    }
    return (
      <div className="oo-scrubber-carousel-container">
        {thumbnailsBefore}
        <div className={thumbnailClassName} ref="thumbnail" style={thumbnailStyle}>
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