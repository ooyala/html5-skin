/**
 * Thumbnail component
 *
 * @module Thumbnail
 */
var React = require('react'),
    ClassNames = require('classnames'),
    CONSTANTS = require('../constants/constants'),
    Utils = require('./utils');

var Thumbnail = React.createClass({

  // findThumbnail: function(hoverTime) {
  //   var thumbnails = this.props.controller.state.thumbnails;
  //   var selectedThumbnail = null;

  //   //logic for selecting thumbnail, will change
  //   var min = -1;
  //   for (var key in thumbnails){
  //     var time = parseInt(key);
  //     if (min == -1 && hoverTime - time >= 0) {
  //       min = hoverTime - time;
  //       selectedThumbnail = thumbnails[key];
  //     }
  //     if (hoverTime - time >= 0 && hoverTime - time < min){
  //       min = hoverTime - time;
  //       selectedThumbnail = thumbnails[key];
  //     }
  //   }
  //   return selectedThumbnail;
  // },

  findThumbnail: function(hoverTime) {
    var thumbnails = this.props.controller.state.thumbnails;
    var timeSlices = thumbnails.data.available_time_slices;
    var width = this.props.controller.state.thumbnails.data.available_widths[0]; //choosing the lowest size
    var selectedTimeSlice = timeSlices[0];
    var selectedThumbnail = null;

    for (var i = 0; i < timeSlices.length; i++) {
      if (timeSlices[i] > hoverTime && i > 0) {
        selectedTimeSlice = timeSlices[i - 1];
        break;
      }
    }
    selectedThumbnail = thumbnails.data.thumbnails[selectedTimeSlice][width].url;
    return selectedThumbnail;
  },

  render: function() {
    var thumbnail = this.findThumbnail(this.props.hoverTime);
    var thumbnailStyle = {};
    var defaultThumbnailWidth = CONSTANTS.UI.defaultThumbnailWidth;
    var hoverPosition = 0;

    if (this.props.hoverPosition - defaultThumbnailWidth/2 >= 0 && this.props.hoverPosition + defaultThumbnailWidth/2 < this.props.scrubberBarWidth) {
      hoverPosition = this.props.hoverPosition - defaultThumbnailWidth/2;
    }
    else if (this.props.hoverPosition + defaultThumbnailWidth/2 > this.props.scrubberBarWidth){
      hoverPosition = this.props.scrubberBarWidth - defaultThumbnailWidth;
    }
    thumbnailStyle.left = hoverPosition;
    thumbnailStyle.backgroundImage = "url("+thumbnail+")";

    var time = isFinite(parseInt(this.props.hoverTime)) ? Utils.formatSeconds(parseInt(this.props.hoverTime)) : null;
    return (
      <div className="oo-thumbnail" style={thumbnailStyle}>
        <div className="oo-thumbnail-time">{time}</div>
      </div>
    );
  }
});

module.exports = Thumbnail;