/**
 * Thumbnail component
 *
 * @module Thumbnail
 */
var React = require('react'),
    Utils = require('./utils');

var Thumbnail = React.createClass({
  getInitialState: function() {
    this.positionXLeft = 0;
    this.positionXRight = 0;
    this.positionY = 0;
    this.imageWidth = 0;
    this.imageHeight = 0;
    this.thumbnailWidthHalf = 40;
    this.thumbnailHeight = 40;
    return {};
  },
  componentDidMount: function() {
    this.setThumbnailSizes();
    this.setImageSizes();
    var yaw = this.props.vrViewingDirection.yaw;
    var pitch = this.props.vrViewingDirection.pitch;
    this.setCurrentViewVr(yaw, pitch);
  },
  componentWillReceiveProps: function(nextProps) {
    if (this.props.vrViewingDirection !== nextProps.vrViewingDirection) {
      var yaw = nextProps.vrViewingDirection.yaw;
      var pitch = nextProps.vrViewingDirection.pitch;
      this.setCurrentViewVr(yaw, pitch);
    }
  },
  shouldComponentUpdate: function(nextProps) {
    var hoverPosition = nextProps.hoverPosition != this.props.hoverPosition;
    var fullscreen  = nextProps.fullscreen != this.props.fullscreen;
    return (hoverPosition || fullscreen);
    // return (nextProps.hoverPosition != this.props.hoverPosition);
  },
  componentDidUpdate: function(prevProps, prevState) {
    var newThumbnailWidth = $("#oo-thumbnail-vr-container").width();
    var newThumbnailHeight = $("#oo-thumbnail-vr-container").height();
    if (newThumbnailWidth !== this.thumbnailWidthHalf*2 || newThumbnailHeight !== this.thumbnailHeight) {
      console.log('BBB WTF newThumbnailWidth', newThumbnailWidth, 'this.thumbnailWidthHalf*2', this.thumbnailWidthHalf*2);
      this.thumbnailWidthHalf = newThumbnailWidth/2;
      this.thumbnailHeight = newThumbnailHeight;
      var yaw = this.props.vrViewingDirection.yaw;
      var pitch = this.props.vrViewingDirection.pitch;
      this.setCurrentViewVr(yaw, pitch);
    }
  },

  setThumbnailSizes: function() {
    var thumbnailWidth = $("#oo-thumbnail-vr-container").width();
    var thumbnailHeight = $("#oo-thumbnail-vr-container").height();
    if (thumbnailWidth) {
      this.thumbnailWidthHalf = thumbnailWidth/2;
    }
    if (thumbnailHeight) {
      this.thumbnailHeight = thumbnailHeight;
    }
  },

  setImageSizes: function() {
    var thumbnail = Utils.findThumbnail(this.props.thumbnails, this.props.hoverTime, this.props.duration, this.props.videoVr);
    this.imageWidth = thumbnail.imageWidth;
    this.imageHeight = thumbnail.imageHeight;
  },

  /**
   *
   * @param {Number} yaw - angle in degrees
   * @param {Number} pitch - angle in degrees
   * @private
   */
  setCurrentViewVr: function(yaw, pitch) {
    yaw = Utils.ensureNumber(yaw, 0);
    pitch = Utils.ensureNumber(pitch, 0);
    var imageWidth = this.imageWidth;
    var imageHeight = this.imageHeight;
    var thumbnailWidth = this.thumbnailWidthHalf*2;
    var thumbnailHeight = this.thumbnailHeight;
    yaw = this.getCurrentYawVr(yaw);
    pitch = pitch >= 360 ? 0 : pitch; //degrees

    var positionXLeft = 0;
    var positionXRight = 0;
    if (yaw === 0) {
      positionXLeft = -(imageWidth - thumbnailWidth/2);
    } else if (yaw < 0) {
      positionXLeft = (-imageWidth + thumbnailWidth/2) * (-yaw) / 360;
      positionXRight = (imageWidth - thumbnailWidth/2) + positionXLeft - imageWidth;
    } else if (yaw > 0) {
      positionXRight = (-imageWidth + thumbnailWidth/2) * (-yaw) / 360;
      positionXLeft = positionXRight + thumbnailWidth/2;
    }
    var positionY = -(((imageHeight - thumbnailHeight) / 2) - pitch);
    var bottomCoordinate = -(imageHeight - thumbnailHeight);
    if (positionY > 0) {
      positionY = 0;
    } else if (positionY < bottomCoordinate) {
      positionY = bottomCoordinate;
    }
    this.positionXLeft = positionXLeft;
    this.positionXRight = positionXRight;
    this.positionY = positionY;
  },

  /**
   *
   * @param {Number} yaw
   * @private
   * @returns {number}
   */
  getCurrentYawVr: function(yaw) {
    var k = yaw <= -360 ? -1 : 1;
    var ratio = (k*yaw)/360;
    ratio = ~~ratio;
    return (yaw - k*ratio*360);
  },

  render: function() {
    var thumbnail = Utils.findThumbnail(this.props.thumbnails, this.props.hoverTime, this.props.duration, this.props.videoVr);
    var time = isFinite(parseInt(this.props.hoverTime)) ? Utils.formatSeconds(parseInt(this.props.hoverTime)) : null;

    var thumbnailBaseStyle = {
      // 'width': this.thumbnailWidthHalf + 'px',
      'backgroundSize': this.imageWidth + "px " + this.imageHeight + "px",
      'backgroundImage': "url('" + thumbnail.url + "')"
    };
    var thumbnailStyleVrLeft = {
      'backgroundPosition': this.positionXLeft + "px " + this.positionY + "px",
    };
    var thumbnailStyleVrRight = {
      'backgroundPosition': this.positionXRight + "px " + this.positionY + "px",
      'left': this.thumbnailWidthHalf + "px", // width of left block with image
    };
    thumbnailStyleVrLeft = $.extend(thumbnailStyleVrLeft, thumbnailBaseStyle);
    thumbnailStyleVrRight = $.extend(thumbnailStyleVrRight, thumbnailBaseStyle);

    var thumbnailStyle = {};
    thumbnailStyle.left = this.props.hoverPosition;
    if (Utils.isValidString(thumbnail.url)) {
      thumbnailStyle.backgroundImage = "url('" + thumbnail.url + "')";
    }

    var thumbnailElement = (
      <div className="oo-thumbnail" ref="thumbnail" style={thumbnailStyle}>
        <div className="oo-thumbnail-time">{time}</div>
      </div>
    );
    if (this.props.videoVr) {
      thumbnailElement = (
        <div id="oo-thumbnail-vr-container" className="oo-thumbnail oo-thumbnail-vr-container" ref="thumbnail" style={{left: this.props.hoverPosition}}>
          <div className="oo-thumbnail-vr oo-thumbnail-vr--left" style={thumbnailStyleVrLeft} />
          <div className="oo-thumbnail-vr oo-thumbnail-vr--right" style={thumbnailStyleVrRight} />
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
  hoverTime: 0,
  vrViewingDirection: { yaw: 0, roll: 0, pitch: 0 },
  videoVr: false,
  fullscreen: false
};

Thumbnail.propTypes = {
  vrViewingDirection: React.PropTypes.shape({
    yaw: React.PropTypes.number,
    roll: React.PropTypes.number,
    pitch: React.PropTypes.number
  }),
  videoVr: React.PropTypes.bool,
  fullscreen: React.PropTypes.bool
};

module.exports = Thumbnail;