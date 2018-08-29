/** ******************************************************************
  AUDIO ONLY SCREEN
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
      'oo-state-screen-audio-title': true,
      'oo-inactive': !this.props.controller.state.controlBarVisible,
      'oo-state-screen-audio-group': true
    });
    var titleClass = ClassNames({
      'oo-state-screen-audio-info': true
      //'oo-pull-right': this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf('right') > -1
    });
    //var descriptionClass = ClassNames({
    //  'oo-state-screen-description': true,
    //  'oo-pull-right': this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf('right') > -1
    //});
    var textStyle = {
      'max-width': '70%'
    };
    var textClass = ClassNames({
      'oo-text-truncate': true
    });
    var titleMetadata = (
      <div style={textStyle} className={textClass}>
        <span className={titleClass} style={titleStyle}>
          {this.props.contentTree.title}
        </span>
        : {this.props.contentTree.description}
      </div>
    );
    //{this.props.contentTree.description ? ':' + {this.props.contentTree.description} : null}
    //var descriptionMetadata = (
    //  <div className={descriptionClass} style={descriptionStyle}>
    //    {this.state.descriptionText}
    //  </div>
    //);
    return (
      <div className="oo-state-screen-audio">
        <div className={infoPanelClass}>
          {this.props.skinConfig.pauseScreen.showTitle ? titleMetadata : null}
        </div>
        <div className="oo-interactive-container oo-state-screen-audio-group">
          <ControlBar
            {...this.props}
            controlBarVisible={this.props.controller.state.controlBarVisible}
            playerState={this.props.playerState}
            isLiveStream={this.props.isLiveStream}
            a11yControls={this.props.controller.accessibilityControls}
          />
        </div>
      </div>
    );
  }
}

module.exports = AudioOnlyScreen;