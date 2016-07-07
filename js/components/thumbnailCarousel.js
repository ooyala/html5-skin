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
    var selectedThumbnail = null;
    var selectedPosition = -1;

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

    selectedThumbnail = thumbnails.data.thumbnails[selectedTimeSlice][width].url;
    return { url: selectedThumbnail, pos: selectedPosition };
  },

  findThumbnailsAfter: function(position) {
    var thumbnails = this.props.thumbnails;
    var timeSlices = thumbnails.data.available_time_slices;
    var width = this.props.thumbnails.data.available_widths[0]; //choosing the lowest size
    var selectedThumbnail = null;
    var selectedPosition = -1;
    var imgWidth = this.state.thumbnailWidth;
    var imgHeight = this.state.thumbnailHeight;
    var centerWidth = this.state.centerThumbnailWidth;
    var centerHeight = this.state.centerThumbnailHeight;
    var scrubberBarWidth = this.props.scrubberBarWidth;
    var start = (scrubberBarWidth + centerWidth) / 2;
    var top = (centerHeight - imgHeight) / 2;

    var thumbmailsAfter = [];

    for (var i = position; i < timeSlices.length; i++) {
      thumbmailsAfter.push(thumbnails.data.thumbnails[timeSlices[i]][width].url);
    }
    return thumbmailsAfter;
  },

  findThumbnailsBefore: function(position) {
    var thumbnails = this.props.thumbnails;
    var timeSlices = thumbnails.data.available_time_slices;
    var width = this.props.thumbnails.data.available_widths[0]; //choosing the lowest size
    var selectedThumbnail = null;
    var selectedPosition = -1;

    var thumbmailsBefore = [];
    for (var i = position; i >= 0; i--) {
      thumbmailsBefore.push(thumbnails.data.thumbnails[timeSlices[i]][width].url);
    }
    return thumbmailsBefore;
  },

  render: function() {
    var centralThumbnail = this.findThumbnail(this.props.hoverTime);
    var thumbnail = centralThumbnail.url;
    var position = centralThumbnail.pos;
    var thumbnailsBefore = this.findThumbnailsBefore(position);
    var thumbnailsAfter = this.findThumbnailsAfter(position);
    var thumbnailStyle = {};
    var imgWidth = this.state.thumbnailWidth;
    var imgHeight = this.state.thumbnailHeight;
    var centerWidth = this.state.centerThumbnailWidth;
    var centerHeight = this.state.centerThumbnailHeight;
    var scrubberBarWidth = this.props.scrubberBarWidth;
    var top = (centerHeight - imgHeight) / 2;

    thumbnailStyle.left = (scrubberBarWidth - centerWidth) / 2;
    thumbnailStyle.backgroundImage = "url("+thumbnail+")";

    var time = isFinite(parseInt(this.props.hoverTime)) ? Utils.formatSeconds(parseInt(this.props.hoverTime)) : null;
    return (<div>
            {
              thumbnailsBefore.map(function (element, i) {
                var left = thumbnailStyle.left - imgWidth * (i + 1);
                if (left >= 0) {
                  var thumbStyle = { left: left, top: top, backgroundImage: "url(" + element + ")" };
                  return <div className="oo-thumbnail" ref="thumbnail" style={thumbStyle}></div>
                }
              })
            }      
            <div className="oo-thumbnail-carousel" ref="thumbnailCarousel" style={thumbnailStyle}>
            <div className="oo-thumbnail-carousel-time">{time}</div>
            </div>
            {
              thumbnailsAfter.map(function (element, i) {
                var left = thumbnailStyle.left + centerWidth + imgWidth * i;
                if (left + imgWidth <= scrubberBarWidth) {
                  var thumbStyle = { left: left, top: top, backgroundImage: "url(" + element + ")" };
                  return <div className="oo-thumbnail" ref="thumbnail" style={thumbStyle}></div>
                }
              })
            }
            </div>
           );
  }
});

module.exports = ThumbnailCarousel;