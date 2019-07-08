import React from 'react';
import ClassNames from 'classnames';
import ControlBar from '../components/controlBar';
import Watermark from '../components/watermark';
import Icon from '../components/icon';
import CastPanel from '../components/castPanel';
import CONSTANTS from '../constants/constants';
import Utils from '../components/utils';

/**
 * The screen to be displayed when asset has finished playing
 */
class EndScreen extends React.Component {
  description = null;

  constructor(props) {
    super(props);
    this.state = {
      controlBarVisible: true,
      descriptionText: props.contentTree.description,
    };
  }

  componentDidMount() {
    this.truncateText();
  }

  /**
   * Launch truncateText if width changed
   * @param {Object} nextProps - next props object
   */
  componentWillReceiveProps = (nextProps) => {
    const { componentWidth } = this.props;
    if (nextProps.componentWidth !== componentWidth) {
      this.truncateText();
    }
  }

  /**
   * Truncate description text
   */
  truncateText = () => {
    if (!this.description) {
      return;
    }
    const { contentTree } = this.props;
    const descriptionText = Utils.truncateTextToWidth(
      this.description,
      contentTree.description
    );

    this.setState({ descriptionText });
  }

  /**
   * Зause or play the video if the skin is clicked
   * @param {Object} event - object
   */
  handleClick = (event) => {
    event.preventDefault();
    const { controller } = this.props;
    controller.state.accessibilityControlsEnabled = true;
    controller.togglePlayPause();
  }

  render() {
    const {
      skinConfig,
      contentTree,
      controller,
      language,
      localizableStrings,
      playerState,
      isLiveStream,
    } = this.props;

    const {
      descriptionText,
      controlBarVisible,
    } = this.state;

    const actionIconStyle = {
      color: skinConfig.endScreen.replayIconStyle.color,
      opacity: skinConfig.endScreen.replayIconStyle.opacity,
    };

    if (controller.state.cast.connected) {
      actionIconStyle.fontSize = '125px';
    }

    const titleStyle = {
      color: skinConfig.startScreen.titleFont.color,
    };
    const descriptionStyle = {
      color: skinConfig.startScreen.descriptionFont.color,
    };

    const actionIconClass = ClassNames({
      'oo-action-icon': true,
      'oo-hidden': !skinConfig.endScreen.showReplayButton,
    });

    const infoPanelPosition = Utils.getPropertyValue(skinConfig, 'endScreen.infoPanelPosition');
    const infoPanelClass = infoPanelPosition
      ? ClassNames({
        'oo-state-screen-info': true,
        'oo-info-panel-top': infoPanelPosition.toLowerCase().indexOf('top') > -1,
        'oo-info-panel-bottom': infoPanelPosition.toLowerCase().indexOf('bottom') > -1,
        'oo-info-panel-left': infoPanelPosition.toLowerCase().indexOf('left') > -1,
        'oo-info-panel-right': infoPanelPosition.toLowerCase().indexOf('right') > -1,
      })
      : undefined;
    const titleClass = infoPanelPosition
      ? ClassNames({
        'oo-state-screen-title': true,
        'oo-text-truncate': true,
        'oo-pull-right': infoPanelPosition.toLowerCase().indexOf('right') > -1,
        'oo-hidden': !Utils.getPropertyValue(skinConfig, 'endScreen.showTitle'),
      })
      : undefined;
    const descriptionClass = infoPanelPosition
      ? ClassNames({
        'oo-state-screen-description': true,
        'oo-pull-right': infoPanelPosition.toLowerCase().indexOf('right') > -1,
        'oo-hidden': !Utils.getPropertyValue(skinConfig, 'endScreen.showDescription'),
      })
      : undefined;

    // Shows the information of the chromecast device just below the replay icon
    const castPanelClass = ClassNames({
      'oo-info-panel-cast-bottom': true,
    });

    const titleMetadata = (
      <div className={titleClass} style={titleStyle}>
        {contentTree.title}
      </div>
    );
    const descriptionMetadata = (
      <div
        className={descriptionClass}
        ref={(node) => { this.description = node; }}
        style={descriptionStyle}
      >
        {descriptionText}
      </div>
    );

    return (
      <div className="oo-state-screen oo-end-screen">
        <div className="oo-underlay-gradient" />

        <a // eslint-disable-line
          className="oo-state-screen-selectable"
          onClick={this.handleClick}
        />

        <Watermark {...this.props} controlBarVisible={controlBarVisible} />

        <div className={infoPanelClass}>
          {titleMetadata}
          {descriptionMetadata}
        </div>

        <button
          type="button"
          className={actionIconClass}
          onClick={this.handleClick}
          onMouseUp={Utils.blurOnMouseUp}
          tabIndex="0"
          aria-label={CONSTANTS.ARIA_LABELS.REPLAY}
        >
          <Icon {...this.props} icon="replay" style={actionIconStyle} />
        </button>

        {
          controller.state.cast.connected
          && (
          <CastPanel
            language={language}
            localizableStrings={localizableStrings}
            device={controller.state.cast.device}
            className={castPanelClass}
          />
          )
        }

        <div className="oo-interactive-container">
          <ControlBar
            {...this.props}
            height={skinConfig.controlBar.height}
            animatingControlBar
            controlBarVisible={controlBarVisible}
            playerState={playerState}
            isLiveStream={isLiveStream}
          />
        </div>
      </div>
    );
  }
}
module.exports = EndScreen;
