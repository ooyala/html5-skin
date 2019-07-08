import React from 'react';
import PropTypes from 'prop-types';

/**
 * Thumbnail component
 */
class Thumbnail extends React.Component {
  componentDidMount() {
    const { onRef } = this.props;
    onRef(this);
  }

  /**
   * Update the component only if specific props got updated
   * @param {Object} nextProps - React next props object
   * @returns {boolean} the decision
   */
  shouldComponentUpdate(nextProps) {
    const {
      fullscreen,
      hoverPosition,
      imageWidth,
      videoVr,
      vrViewingDirection,
    } = this.props;
    const updateHoverPositon = nextProps.hoverPosition !== hoverPosition;
    const updateFullscreen = nextProps.fullscreen !== fullscreen && videoVr;
    const updateVrViewDirection = nextProps.vrViewingDirection !== vrViewingDirection;
    const updateImageWidth = nextProps.imageWidth !== imageWidth;
    return updateHoverPositon || updateFullscreen || updateVrViewDirection || updateImageWidth;
  }

  componentWillUnmount() {
    const { onRef } = this.props;
    onRef(undefined);
  }

  render() {
    const { thumbnailStyle, time, videoVr } = this.props;
    const thumbnailClassName = videoVr ? 'oo-thumbnail oo-thumbnail-vr' : 'oo-thumbnail';

    return (
      <div className="oo-scrubber-thumbnail-container">
        <div
          className={thumbnailClassName}
          // this ref is used in the parent component to set image size
          // TODO: get rid of this ugly violation of IOC
          // eslint-disable-next-line react/no-string-refs
          ref="thumbnail"
          style={thumbnailStyle}
        >
          <div className="oo-thumbnail-time">{time}</div>
        </div>
      </div>
    );
  }
}

Thumbnail.defaultProps = {
  thumbnails: {},
  thumbnailStyle: {},
  hoverPosition: 0,
  vrViewingDirection: { yaw: 0, roll: 0, pitch: 0 },
  videoVr: false,
  fullscreen: false,
  onRef: () => {},
  imageWidth: 0,
  time: '',
};

Thumbnail.propTypes = {
  hoverPosition: PropTypes.number,
  onRef: PropTypes.func,
  thumbnails: PropTypes.shape({}),
  thumbnailStyle: PropTypes.shape({}),
  vrViewingDirection: PropTypes.shape({
    yaw: PropTypes.number,
    roll: PropTypes.number,
    pitch: PropTypes.number,
  }),
  time: PropTypes.string,
  imageWidth: PropTypes.number,
  videoVr: PropTypes.bool,
  fullscreen: PropTypes.bool,
};

module.exports = Thumbnail;
