/**
 * Thumbnail component
 *
 * @module Thumbnail
 */
var React = require('react'),
    ClassNames = require('classnames'),
    Utils = require('./utils'),
    Icon = require('../components/icon');

var Thumbnail = React.createClass({
  getInitialState: function() {
    return {
      thumbnail: this.findThumbnail(this.props.hoverTime)
    };
  },

  findThumbnail: function(hoverTime) {
    hoverTime = hoverTime >= 0 ? hoverTime : 0;
    var thumbnails = this.props.controller.state.thumbnails;
    var selectedThumbnail = null;
    var min = -1;
    for (var key in thumbnails){
      var time = parseInt(key);
      if (min == -1 && hoverTime - time >= 0) {
        min = hoverTime - time;
        selectedThumbnail = thumbnails[key];
      }
      if (hoverTime - time >= 0 && hoverTime - time < min){
        min = hoverTime - time;
        selectedThumbnail = thumbnails[key];
      }
    }
    return selectedThumbnail;
  },

  render: function() {
    var thumbnail = this.findThumbnail(this.props.hoverTime);
    var thumbnailStyle = {};
    var hoverPosition = 113/2;
    if (this.props.hoverPosition >= 113/2 && this.props.hoverPosition < this.props.scrubberBarWidth - 113/2) {
      hoverPosition = this.props.hoverPosition;
    }
    else if (this.props.hoverPosition > this.props.scrubberBarWidth - 113/2){
      hoverPosition = this.props.scrubberBarWidth - 113/2;
    }
    thumbnailStyle.left = hoverPosition - 113/2;
    thumbnailStyle.backgroundImage = "url("+thumbnail+")";

    var time = isFinite(parseInt(this.props.hoverTime)) ? Utils.formatSeconds(parseInt(this.props.hoverTime)) : null;
    return (
      <div className="oo-thumbnail" style={thumbnailStyle}>
        <div className="oo-thumbnail-time">{time}</div>
      </div>
    );
  }
});

Thumbnail.propTypes = {
  // videoQualityOptions: React.PropTypes.shape({
  //   availableBitrates: React.PropTypes.arrayOf(React.PropTypes.shape({
  //     id: React.PropTypes.string,
  //     bitrate: React.PropTypes.number,
  //     label: React.PropTypes.string
  //   }))
  // }),
  // togglePopoverAction: React.PropTypes.func,
  // controller: React.PropTypes.shape({
  //   sendVideoQualityChangeEvent: React.PropTypes.func
  // })
};

Thumbnail.defaultProps = {
  // popover: false,
  // skinConfig: {
  //   icons: {
  //     quality:{fontStyleClass:'oo-icon oo-icon-topmenu-quality'}
  //   }
  // },
  // videoQualityOptions: {
  //   availableBitrates: []
  // },
  // togglePopoverAction: function(){},
  // controller: {
  //   sendVideoQualityChangeEvent: function(a){}
  // }
};

module.exports = Thumbnail;