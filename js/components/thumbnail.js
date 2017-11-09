/**
 * Thumbnail component
 *
 * @module Thumbnail
 */
var React = require('react'),
    Utils = require('./utils');

var Thumbnail = React.createClass({
  shouldComponentUpdate: function(nextProps) {
    return (nextProps.hoverPosition != this.props.hoverPosition);
  },

  getCurrentViewVr: function(yaw, pitch) {
    var imageWidth = 320; //px
    var imageHeight = 160; //px
    var thumbnailWidth = 80; //px
    var thumbnailHeight = 40; //px
    yaw = yaw === 0 ? 360 : yaw; //degrees
    pitch = pitch === 0 ? 360 : pitch; //degrees
    var positionXLeft = (-imageWidth + thumbnailWidth/2) * yaw / 360;
    var positionXRight = (imageWidth - thumbnailWidth/2) + positionXLeft - imageWidth;
    console.log('BBB positionXLeft', positionXLeft);
    console.log('BBB positionXRight', -positionXRight);
    var positionY = pitch * imageHeight / 360 + thumbnailHeight;
    console.log('BBB positionY', -positionY);
    return {}
  },

  render: function() {
    var thumbnail = Utils.findThumbnail(this.props.thumbnails, this.props.hoverTime, this.props.duration);
    var time = isFinite(parseInt(this.props.hoverTime)) ? Utils.formatSeconds(parseInt(this.props.hoverTime)) : null;

    var thumbnailStyle = {};
    var thumbnailStyleVrLeft = {
      'width': '40px',
      'backgroundSize': '320px 160px',
      'backgroundPosition': '-280px -40px',
      'backgroundImage': "url('" + thumbnail.url + "')",
      'boxShadow': 'none',
      'borderRadius': '2.8px 0 0 2.8px'
    };
    var thumbnailStyleVrRight = {
      'width': '40px',
      'backgroundSize': '320px 160px',
      'backgroundPosition': '0 -40px',
      'backgroundImage': "url('" + thumbnail.url + "')",
      'left': '40px',
      'boxShadow': 'none',
      'borderRadius': '0 2.8px 2.8px 0'
    };
    thumbnailStyle.left = this.props.hoverPosition;
    if (Utils.isValidString(thumbnail.url)) {
      thumbnailStyle.backgroundImage = "url('" + thumbnail.url + "')";
    }

    this.getCurrentViewVr(120, 0);

    var thumbnailElement = (
      <div className="oo-thumbnail" ref="thumbnail" style={thumbnailStyle}>
        <div className="oo-thumbnail-time">{time}</div>
      </div>
    );
    if (true) {
      thumbnailElement = (
        <div className="oo-thumbnail-vr-container" ref="thumbnail" style={{width: '80px'}}>
          <div className="oo-thumbnail oo-thumbnail-vr" ref="thumbnail" style={thumbnailStyleVrLeft} />
          <div className="oo-thumbnail oo-thumbnail-vr" ref="thumbnail" style={thumbnailStyleVrRight} />
          <div className="oo-thumbnail-time">{time}</div>
        </div>
      );
    }

    return (
      <div className="oo-scrubber-thumbnail-container">
        {thumbnailElement}
      </div>
    );
  }
});

Thumbnail.defaultProps = {
  thumbnails: {},
  hoverPosition: 0,
  duration: 0,
  hoverTime: 0
};

module.exports = Thumbnail;