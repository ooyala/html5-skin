/********************************************************************
 VIDEO QUALITY SCREEN
 *********************************************************************/
/**
 * This screen displays when user selects video quality.
 *
 * @class VideoQualityScreen
 * @constructor
 */
var React = require('react'),
    CONSTANTS = require('../constants/constants'),
    VideoQualityPanel = require('../components/videoQualityPanel'),
    CloseButton = require('../components/closeButton'),
    AccessibilityMixin = require('../mixins/accessibilityMixin'),
    ScrollArea = require('react-scrollbar/dist/no-css'),
    Icon = require('../components/icon');

var VideoQualityScreen = React.createClass({
  mixins: [AccessibilityMixin],

  handleClose: function() {
    this.props.controller.toggleScreen(CONSTANTS.SCREEN.VIDEO_QUALITY_SCREEN);
  },

  render: function() {
    return (
      <div className="state-screen quality-screen">
        <div className="quality-panel-title">
          Video Quality
          <Icon {...this.props} icon="quality"/>
        </div>
        <ScrollArea className="quality-screen-content">
          <VideoQualityPanel {...this.props} />
        </ScrollArea>
        <CloseButton {...this.props} closeAction={this.handleClose}/>
      </div>
    );
  }
});

VideoQualityScreen.propTypes = {
  skinConfig: React.PropTypes.shape({
    icons: React.PropTypes.shape({
      dismiss: React.PropTypes.shape({
        fontStyleClass: React.PropTypes.string
      })
    })
  })
};

VideoQualityScreen.defaultProps = {
  skinConfig: {
    icons: {
      dismiss:{fontStyleClass:'icon icon-close'}
    }
  },
  controller: {
    toggleScreen: function(){},
    state: {
      accessibilityControlsEnabled: true
    }
  }
};

module.exports = VideoQualityScreen;