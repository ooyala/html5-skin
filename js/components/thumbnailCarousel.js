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
      thumbnailWidth: 0,
      thumbnailHeight: 0,
      centerThumbnailWidth: 0,
      centerThumbnailHeight: 0
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

  findThumbnailsAfter: function(data) {
    var start = (data.scrubberBarWidth + data.centerWidth) / 2;

    var thumbmailsAfter = [];
    for (var i = data.pos, j = 0; i < data.timeSlices.length; i++, j++) {
      var left = start + data.imgWidth * j;
      if (left + data.imgWidth <= data.scrubberBarWidth) {
        var thumbStyle = { left: left, top: data.top, backgroundImage: "url(" + data.thumbnails.data.thumbnails[data.timeSlices[i]][data.width].url + ")" };
        thumbmailsAfter.push(thumbStyle);
      }
    }
    return thumbmailsAfter;
  },

  findThumbnailsBefore: function(data) {
    var start = (data.scrubberBarWidth - data.centerWidth) / 2;

    var thumbmailsBefore = [];
    for (var i = data.pos, j = 0; i >= 0; i--, j++) {
      var left = start - data.imgWidth * (j + 1);
      if (left >= 0) {
        var thumbStyle = { left: left, top: data.top, backgroundImage: "url(" + data.thumbnails.data.thumbnails[data.timeSlices[i]][data.width].url + ")" };
        thumbmailsBefore.push(thumbStyle);
      }
    }
    return thumbmailsBefore;
  },

  render: function() {
    var centralThumbnail = this.findThumbnail(this.props.hoverTime);
    var data = {
      thumbnails: this.props.thumbnails,
      timeSlices: this.props.thumbnails.data.available_time_slices,
      width: this.props.thumbnails.data.available_widths[0],
      imgWidth: this.state.thumbnailWidth,
      centerWidth: this.state.centerThumbnailWidth,
      scrubberBarWidth: this.props.scrubberBarWidth,
      top: (this.state.centerThumbnailHeight - this.state.thumbnailHeight) / 2,
      pos: centralThumbnail.pos
    }
    var thumbnailsBefore = this.findThumbnailsBefore(data);
    var thumbnailsAfter = this.findThumbnailsAfter(data);

    var thumbnailStyle = { left: (data.scrubberBarWidth - data.centerWidth) / 2, backgroundImage: "url(" + centralThumbnail.url + ")" };
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