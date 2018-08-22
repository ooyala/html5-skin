/** ******************************************************************
  AD SCREEN
*********************************************************************/
const React = require('React');
const ControlBar = require('../components/controlBar');
const ClassNames = require('classnames');

class AudioOnlyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //descriptionText: this.props.contentTree.description,
      //containsText:
      //  (this.props.skinConfig.pauseScreen.showTitle && !!this.props.contentTree.title) ||
      //  (this.props.skinConfig.pauseScreen.showDescription && !!this.props.contentTree.description),
      controlBarVisible: true,
      animate: false
    };
  }

  render() {
    var titleStyle = {
      color: this.props.skinConfig.startScreen.titleFont.color
    };
    //var descriptionStyle = {
    //  color: this.props.skinConfig.startScreen.descriptionFont.color
    //};
    var infoPanelClass = ClassNames({
      'oo-state-screen-info': true,
      'oo-inactive': !this.props.controller.state.controlBarVisible,
      'oo-info-panel-top':
        this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf('top') > -1,
      'oo-info-panel-bottom':
        this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf('bottom') > -1,
      'oo-info-panel-left':
        this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf('left') > -1,
      'oo-info-panel-right':
        this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf('right') > -1
    });
    var titleClass = ClassNames({
      'oo-state-screen-title': true,
      'oo-text-truncate': true,
      'oo-pull-right': this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf('right') > -1
    });
    //var descriptionClass = ClassNames({
    //  'oo-state-screen-description': true,
    //  'oo-pull-right': this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf('right') > -1
    //});
    var titleMetadata = (
      <div className={titleClass} style={titleStyle}>
        {this.props.contentTree.title}
      </div>
    );
    //var descriptionMetadata = (
    //  <div className={descriptionClass} style={descriptionStyle}>
    //    {this.state.descriptionText}
    //  </div>
    //);
    return (
      <div>
        <div className="oo-state-screen">
          <div className={infoPanelClass}>
            {this.props.skinConfig.pauseScreen.showTitle ? titleMetadata : null}
          </div>
          <div className="oo-interactive-container">
            <ControlBar
              {...this.props}
              controlBarVisible={this.props.controller.state.controlBarVisible}
              playerState={this.props.playerState}
              isLiveStream={this.props.isLiveStream}
              skipControlsConfig={this.props.controller.state.skipControls}
              a11yControls={this.props.controller.accessibilityControls}
            />
          </div>
        </div>
      </div>
    );
  }
}

module.exports = AudioOnlyScreen;