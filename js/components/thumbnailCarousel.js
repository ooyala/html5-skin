/**
 * ThumbnailCarousel component
 *
 * @module ThumbnailCarousel
 */
var React = require('react'),
    ClassNames = require('classnames'),
    ReactDOM = require('react-dom'),
    Utils = require('./utils');

var ThumbnailCarousel = React.createClass({
  getInitialState: function() {
    return {
      thumbnailWidth: 0
    };
  },

  componentDidMount: function() {
    var carousel = ReactDOM.findDOMNode(this.refs.thumbnailCarousel);
    this.setState({thumbnailWidth: carousel.clientWidth / 2,
                   thumbnailHeight: carousel.clientHeight / 2,
                   centerThumbnailWidth: carousel.clientWidth,
                   centerThumbnailHeight: carousel.clientHeight});
  },

  findThumbnail: function(hoverTime) {
    var thumbnails = this.props.thumbnails;
    var timeSlices = thumbnails.data.available_time_slices;
    var width = this.props.thumbnails.data.available_widths[0]; //choosing the lowest size

    var position = Math.floor((hoverTime/this.props.duration) * timeSlices.length);
    position = Math.min(position, timeSlices.length - 1);
    position = Math.max(position, 0);

    if (timeSlices[position] >= hoverTime) {
      var selectedTimeSlice = timeSlices[0];
      for (var i = position; i >= 0; i--) {
        if (timeSlices[i] < hoverTime) {
          selectedTimeSlice = timeSlices[i];
          selectedPosition = i;
          break;
        }
      }
    }
    else {
      var selectedTimeSlice = timeSlices[timeSlices.length - 1];
      for (var i = position; i < timeSlices.length; i++) {
        if (timeSlices[i] > hoverTime) {
          selectedTimeSlice = timeSlices[i - 1];
          selectedPosition = i - 1;
          break;
        }
      }
    }

    var selectedThumbnail = thumbnails.data.thumbnails[selectedTimeSlice][width].url;
    return { url: selectedThumbnail, pos: selectedPosition };
  },

  findThumbnailsAfter: function(position) {
    var thumbnails = this.props.thumbnails;
    var timeSlices = thumbnails.data.available_time_slices;
    var width = this.props.thumbnails.data.available_widths[0]; //choosing the lowest size
    var imgWidth = this.state.thumbnailWidth;
    var imgHeight = this.state.thumbnailHeight;
    var centerWidth = this.state.centerThumbnailWidth;
    var centerHeight = this.state.centerThumbnailHeight;
    var scrubberBarWidth = this.props.scrubberBarWidth;
    var start = (scrubberBarWidth + centerWidth) / 2;
    var top = (centerHeight - imgHeight) / 2;

    var thumbmailsAfter = [];
    for (var i = position, j = 0; i < timeSlices.length; i++, j++) {
      var left = start + imgWidth * j;
      if (left + imgWidth <= scrubberBarWidth) {
        var thumbStyle = { left: left, top: top, backgroundImage: "url(" + thumbnails.data.thumbnails[timeSlices[i]][width].url + ")" };
        thumbmailsAfter.push(thumbStyle);
      }
    }
    return thumbmailsAfter;
  },

  findThumbnailsBefore: function(position) {
    var thumbnails = this.props.thumbnails;
    var timeSlices = thumbnails.data.available_time_slices;
    var width = this.props.thumbnails.data.available_widths[0]; //choosing the lowest size
    var imgWidth = this.state.thumbnailWidth;
    var imgHeight = this.state.thumbnailHeight;
    var centerWidth = this.state.centerThumbnailWidth;
    var centerHeight = this.state.centerThumbnailHeight;
    var scrubberBarWidth = this.props.scrubberBarWidth;
    var start = (scrubberBarWidth - centerWidth) / 2;
    var top = (centerHeight - imgHeight) / 2;

    var thumbmailsBefore = [];
    for (var i = position, j = 0; i >= 0; i--, j++) {
      var left = start - imgWidth * (j + 1);
      if (left >= 0) {
        var thumbStyle = { left: left, top: top, backgroundImage: "url(" + thumbnails.data.thumbnails[timeSlices[i]][width].url + ")" };
        thumbmailsBefore.push(thumbStyle);
      }
    }
    return thumbmailsBefore;
  },

  render: function() {
    var centralThumbnail = this.findThumbnail(this.props.hoverTime);
    var thumbnailsBefore = this.findThumbnailsBefore(centralThumbnail.pos);
    var thumbnailsAfter = this.findThumbnailsAfter(centralThumbnail.pos);
    var centerWidth = this.state.centerThumbnailWidth;
    var scrubberBarWidth = this.props.scrubberBarWidth;

    var thumbnailStyle = { left: (scrubberBarWidth - centerWidth) / 2, backgroundImage: "url(" + centralThumbnail.url + ")" };
    var time = isFinite(parseInt(this.props.hoverTime)) ? Utils.formatSeconds(parseInt(this.props.hoverTime)) : null;
    return (<div>
            {
              thumbnailsBefore.map(function (element, i) {
                return <div className="oo-thumbnail" ref="thumbnail" style={element}></div>
              })
            }      
            <div className="oo-thumbnail-carousel" ref="thumbnailCarousel" style={thumbnailStyle}>
            <div className="oo-thumbnail-carousel-time">{time}</div>
            </div>
            {
              thumbnailsAfter.map(function (element, i) {
                return <div className="oo-thumbnail" ref="thumbnail" style={element}></div>
              })
            }
            </div>
           );
  }
});

module.exports = ThumbnailCarousel;