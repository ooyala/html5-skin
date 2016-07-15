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
    return {
      thumbnailWidth: 0,
      thumbnailHeight: 0,
      centerThumbnailWidth: 0,
      centerThumbnailHeight: 0
    };
  },

  componentDidMount: function() {
    var thumbnail = ReactDOM.findDOMNode(this.refs.thumbnail);
    var carousel = ReactDOM.findDOMNode(this.refs.thumbnailCarousel);
    this.setState({thumbnailWidth: thumbnail.clientWidth,
                   thumbnailHeight: thumbnail.clientHeight,
                   centerThumbnailWidth: carousel.clientWidth,
                   centerThumbnailHeight: carousel.clientHeight});
  },

  shouldComponentUpdate: function(nextProps) {
    return (nextProps.hoverPosition != this.props.hoverPosition);
  },

  findThumbnailsAfter: function(data) {
    var start = (data.scrubberBarWidth + data.centerWidth) / 2;

    var thumbnailsAfter = [];
    for (var i = data.pos, j = 0; i < data.timeSlices.length; i++, j++) {
      var left = start + data.imgWidth * j;
      if (left + data.imgWidth <= data.scrubberBarWidth) {
        var thumbStyle = { left: left, top: data.top, backgroundImage: "url(" + data.thumbnails.data.thumbnails[data.timeSlices[i]][data.width].url + ")" };
        thumbnailsAfter.push(thumbStyle);
      }
    }
    return thumbnailsAfter;
  },

  findThumbnailsBefore: function(data) {
    var start = (data.scrubberBarWidth - data.centerWidth) / 2;

    var thumbnailsBefore = [];
    for (var i = data.pos, j = 0; i >= 0; i--, j++) {
      var left = start - data.imgWidth * (j + 1);
      if (left >= 0) {
        var thumbStyle = { left: left, top: data.top, backgroundImage: "url(" + data.thumbnails.data.thumbnails[data.timeSlices[i]][data.width].url + ")" };
        thumbnailsBefore.push(thumbStyle);
      }
    }
    return thumbnailsBefore;
  },

  render: function() {
    var centralThumbnail = Utils.findThumbnail(this.props.thumbnails, this.props.hoverTime, this.props.duration);
    var data = {
      thumbnails: this.props.thumbnails,
      timeSlices: this.props.thumbnails.data.available_time_slices,
      width: this.props.thumbnails.data.available_widths[0],
      imgWidth: this.state.thumbnailWidth,
      centerWidth: this.state.centerThumbnailWidth,
      scrubberBarWidth: this.props.scrubberBarWidth,
      top: this.state.centerThumbnailHeight - this.state.thumbnailHeight,
      pos: centralThumbnail.pos
    };
    
    var thumbnailsBefore = this.findThumbnailsBefore(data);
    var thumbnailsAfter = this.findThumbnailsAfter(data);
    var thumbnailStyle = { left: (data.scrubberBarWidth - data.centerWidth) / 2, backgroundImage: "url(" + centralThumbnail.url + ")" };
    var time = isFinite(parseInt(this.props.hoverTime)) ? Utils.formatSeconds(parseInt(this.props.hoverTime)) : null;

    return (
      <div className="oo-scrubber-carousel-container">
        {
          thumbnailsBefore.map(function (element, i) {
            return <div className="oo-thumbnail-carousel-image" key={i} ref="thumbnail" style={element}></div>
          })
        }      
        <div className="oo-thumbnail-carousel-center-image" ref="thumbnailCarousel" style={thumbnailStyle}>
          <div className="oo-thumbnail-carousel-time">{time}</div>
        </div>
        {
          thumbnailsAfter.map(function (element, i) {
            return <div className="oo-thumbnail-carousel-image" key={i} ref="thumbnail" style={element}></div>
          })
        }
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
