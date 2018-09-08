const React = require('react');
const PropTypes = require('prop-types');
const ControlBar = require('./controlBar');

/**
 * Volume menu. This component is used for both the Popover and
 * Screen modes of the menu.
 */
class VolumePanel extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="oo-absolute-centered oo-volume-panel">
        <ControlBar
          {...this.props}
          hideScrubberBar={true}
          controlBarVisible={true}
          playerState={this.props.playerState}
          isLiveStream={this.props.isLiveStream}
          a11yControls={this.props.a11yControls}
          currentPlayhead={this.props.currentPlayhead}
          duration={this.props.duration}
          getTotalTime={this.props.getTotalTime}
          getPlayheadTime={this.props.getPlayheadTime}
          buffered={this.props.buffered}
          responsiveView={this.props.responsiveId}
          componentWidth={this.props.componentWidth}
          controlBarItems={[{"name":"volume", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":200 }]}
          />
      </div>
    );
  }
}

VolumePanel.propTypes = {
  getTotalTime: PropTypes.func.isRequired,
  getPlayheadTime: PropTypes.func.isRequired,
  clickToVolumeScreen: PropTypes.bool,
  hideVolumeControls: PropTypes.bool,
  hideScrubberBar: PropTypes.bool,
  audioOnly: PropTypes.bool,
  equalSpacing: PropTypes.bool,
  isLiveStream: PropTypes.bool,
  controlBarVisible: PropTypes.bool,
  playerState: PropTypes.string,
  responsiveView: PropTypes.string,
  language: PropTypes.string,
  localizableStrings: PropTypes.object,
  duration: PropTypes.number,
  currentPlayhead: PropTypes.number,
  componentWidth: PropTypes.number,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  skinConfig: PropTypes.shape({
    responsive: PropTypes.shape({
      breakpoints: PropTypes.object
    })
  }),
  controller: PropTypes.shape({
    state: PropTypes.object,
    videoVrSource: PropTypes.shape({
      vr: PropTypes.object
    }),
    cancelTimer: PropTypes.func,
    startHideControlBarTimer: PropTypes.func,
    hideVolumeSliderBar: PropTypes.func,
    closePopover: PropTypes.func,
    closeOtherPopovers: PropTypes.func,
    isVrStereo: PropTypes.bool
  })
};

module.exports = VolumePanel;
