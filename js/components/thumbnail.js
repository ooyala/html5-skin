/**
 * Thumbnail component
 *
 * @module Thumbnail
 */
var React = require('react'),
    ClassNames = require('classnames'),
    ReactDOM = require('react-dom'),
    Utils = require('./utils');

var Thumbnail = React.createClass({
  getInitialState: function() {
    return {
      thumbnailWidth: 0
    };
  },

  componentDidMount: function() {
    this.setState({thumbnailWidth: ReactDOM.findDOMNode(this.refs.thumbnail).clientWidth});
  },

  render: function() {
    var thumbnail = Utils.findThumbnail(this.props.thumbnails, this.props.hoverTime, this.props.duration);
    var thumbnailStyle = {};
    var defaultThumbnailWidth = this.state.thumbnailWidth;
    var hoverPosition = 0;

    if (this.props.hoverPosition - defaultThumbnailWidth/2 >= 0 && this.props.hoverPosition + defaultThumbnailWidth/2 < this.props.scrubberBarWidth) {
      hoverPosition = this.props.hoverPosition - defaultThumbnailWidth/2;
    }
    else if (this.props.hoverPosition + defaultThumbnailWidth/2 > this.props.scrubberBarWidth){
      hoverPosition = this.props.scrubberBarWidth - defaultThumbnailWidth;
    }
    thumbnailStyle.left = hoverPosition;
    thumbnailStyle.backgroundImage = "url("+thumbnail.url+")";

    var time = isFinite(parseInt(this.props.hoverTime)) ? Utils.formatSeconds(parseInt(this.props.hoverTime)) : null;
    return (
      <div className="oo-thumbnail" ref="thumbnail" style={thumbnailStyle}>
        <div className="oo-thumbnail-time">{time}</div>
      </div>
    );
  }
});

module.exports = Thumbnail;