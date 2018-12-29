import React from 'react';
import ReactDOM from 'react-dom';
import ClassNames from 'classnames';
import ControlBar from '../components/controlBar';
import Watermark from '../components/watermark';
import Icon from '../components/icon';
import CastPanel from '../components/castPanel';
import CONSTANTS from '../constants/constants';
import Utils from '../components/utils';
/* eslint-disable react/destructuring-assignment */

/**
 * The screen to be displayed when asset has finished playing
 */
class EndScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      controlBarVisible: true,
      descriptionText: this.props.contentTree.description,
    };
  }

  componentDidMount() {
    this.handleResize();
  }

  /**
   * Launch handle resize if width changed
   * @param {Object} nextProps - next props object
   */
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.componentWidth !== this.props.componentWidth) {
      this.handleResize();
    }
  }

  /**
   * Proceed the view after the width has been changed
   */
  handleResize = () => {
    if (ReactDOM.findDOMNode(this.refs.description)) { // eslint-disable-line
      this.setState({
        descriptionText: Utils.truncateTextToWidth(
          ReactDOM.findDOMNode(this.refs.description), // eslint-disable-line
          this.props.contentTree.description
        ),
      });
    }
  }

  /**
   * Зause or play the video if the skin is clicked
   * @param {Object} event - object
   */
  handleClick = (event) => {
    event.preventDefault();
    this.props.controller.state.accessibilityControlsEnabled = true;
    this.props.controller.togglePlayPause();
  }

  render() {
    const actionIconStyle = {
      color: this.props.skinConfig.endScreen.replayIconStyle.color,
      opacity: this.props.skinConfig.endScreen.replayIconStyle.opacity,
    };

    if (this.props.controller.state.cast.connected) {
      actionIconStyle.fontSize = '125px';
    }

    const titleStyle = {
      color: this.props.skinConfig.startScreen.titleFont.color,
    };
    const descriptionStyle = {
      color: this.props.skinConfig.startScreen.descriptionFont.color,
    };

    const actionIconClass = ClassNames({
      'oo-action-icon': true,
      'oo-hidden': !this.props.skinConfig.endScreen.showReplayButton,
    });

    const infoPanelPosition = Utils.getPropertyValue(this.props.skinConfig, 'endScreen.infoPanelPosition');
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
        'oo-hidden': !Utils.getPropertyValue(this.props.skinConfig, 'endScreen.showTitle'),
      })
      : undefined;
    const descriptionClass = infoPanelPosition
      ? ClassNames({
        'oo-state-screen-description': true,
        'oo-pull-right': infoPanelPosition.toLowerCase().indexOf('right') > -1,
        'oo-hidden': !Utils.getPropertyValue(this.props.skinConfig, 'endScreen.showDescription'),
      })
      : undefined;

    // Shows the information of the chromecast device just below the replay icon
    const castPanelClass = ClassNames({
      'oo-info-panel-cast-bottom': true,
    });

    const titleMetadata = (
      <div className={titleClass} style={titleStyle}>
        {this.props.contentTree.title}
      </div>
    );
    const descriptionMetadata = (
      <div
        className={descriptionClass}
        ref="description" // eslint-disable-line
        style={descriptionStyle}
      >
        {this.state.descriptionText}
      </div>
    );

    return (
      <div className="oo-state-screen oo-end-screen">
        <div className="oo-underlay-gradient" />

        <a // eslint-disable-line
          className="oo-state-screen-selectable"
          onClick={this.handleClick}
        />

        <Watermark {...this.props} controlBarVisible={this.state.controlBarVisible} />

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
          this.props.controller.state.cast.connected
          && (
          <CastPanel
            language={this.props.language}
            localizableStrings={this.props.localizableStrings}
            device={this.props.controller.state.cast.device}
            className={castPanelClass}
          />
          )
        }

        <div className="oo-interactive-container">
          <ControlBar
            {...this.props}
            height={this.props.skinConfig.controlBar.height}
            animatingControlBar
            controlBarVisible={this.state.controlBarVisible}
            playerState={this.props.playerState}
            isLiveStream={this.props.isLiveStream}
          />
        </div>
      </div>
    );
  }
}
module.exports = EndScreen;
