import React from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import CONSTANTS from '../constants/constants';
import Watermark from '../components/watermark';
import Icon from '../components/icon';
import Spinner from '../components/spinner';
import Utils from '../components/utils';

/**
 * The screen to be displayed on initial stage
 */
class StartScreen extends React.Component {
  description = null;

  constructor(props) {
    super(props);

    this.state = {
      playButtonClicked: false,
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
   * Avoid starting playback when player is initializing (play button is disabled
   * in this state, but you can still click on the thumbnail)
   * @param {Object} event click object
   */
  handleClick = (event) => {
    const {
      isInitializing,
      controller,
    } = this.props;
    if (isInitializing) {
      return;
    }
    event.preventDefault();
    controller.togglePlayPause();
    controller.state.accessibilityControlsEnabled = true;
    this.setState({ playButtonClicked: true });
  }

  render() {
    const {
      skinConfig,
      contentTree,
      controller,
      isInitializing,
      showSpinner,
    } = this.props;

    const {
      descriptionText,
      playButtonClicked,
    } = this.state;

    // inline style for config/skin.json elements only
    const titleStyle = {
      color: skinConfig.startScreen.titleFont.color,
    };
    const descriptionStyle = {
      color: skinConfig.startScreen.descriptionFont.color,
    };
    const actionIconStyle = {
      color: skinConfig.startScreen.playIconStyle.color,
      opacity: skinConfig.startScreen.playIconStyle.opacity,
    };
    const posterImageUrl = skinConfig.startScreen.showPromo
      ? contentTree.promo_image
      : '';
    const posterStyle = {};
    if (Utils.isValidString(posterImageUrl)) {
      posterStyle.backgroundImage = `url('${posterImageUrl}')`;
    }

    // CSS class manipulation from config/skin.json
    const stateScreenPosterClass = ClassNames({
      'oo-state-screen-poster': skinConfig.startScreen.promoImageSize !== 'small',
      'oo-state-screen-poster-small': skinConfig.startScreen.promoImageSize === 'small',
    });
    const infoPanelPosition = skinConfig.startScreen.infoPanelPosition.toLowerCase();
    const playButtonPosition = skinConfig.startScreen.playButtonPosition.toLowerCase();
    const infoPanelClass = ClassNames({
      'oo-state-screen-info': true,
      'oo-info-panel-top': infoPanelPosition.indexOf('top') > -1,
      'oo-info-panel-bottom': infoPanelPosition.indexOf('bottom') > -1,
      'oo-info-panel-left': infoPanelPosition.indexOf('left') > -1,
      'oo-info-panel-right': infoPanelPosition.indexOf('right') > -1,
    });
    const titleClass = ClassNames({
      'oo-state-screen-title': true,
      'oo-text-truncate': true,
      'oo-pull-right': infoPanelPosition.indexOf('right') > -1,
    });
    const descriptionClass = ClassNames({
      'oo-state-screen-description': true,
      'oo-pull-right': infoPanelPosition.indexOf('right') > -1,
    });
    const actionIconClass = ClassNames({
      'oo-action-icon': true,
      'oo-action-icon-top': playButtonPosition.indexOf('top') > -1,
      'oo-action-icon-bottom': playButtonPosition.indexOf('bottom') > -1,
      'oo-action-icon-left': playButtonPosition.indexOf('left') > -1,
      'oo-action-icon-right': playButtonPosition.indexOf('right') > -1,
      'oo-hidden': !skinConfig.startScreen.showPlayButton,
    });

    const titleMetadata = (
      <div className={titleClass} style={titleStyle}>
        {contentTree.title}
      </div>
    );
    const iconName = controller.state.playerState === CONSTANTS.STATE.END ? 'replay' : 'play';
    // The descriptionText value doesn't react to changes in contentTree.description since
    // it's being handled as internal state in order to allow truncating it on player resize.
    // We need to migrate truncateTextToWidth to a CSS solution in order to avoid this.
    const descriptionMetadata = (
      <div
        className={descriptionClass}
        ref={(node) => { this.description = node; }}
        style={descriptionStyle}
      >
        {descriptionText || contentTree.description}
      </div>
    );

    let actionIcon; let
      infoPanel;
    // We do not show the action icon, title or description when the player is initializing
    if (!isInitializing) {
      actionIcon = (
        <button
          type="button"
          className={actionIconClass}
          onMouseUp={Utils.blurOnMouseUp}
          onClick={this.handleClick}
          tabIndex="0"
          aria-label={CONSTANTS.ARIA_LABELS.START_PLAYBACK}
        >
          <Icon {...this.props} icon={iconName} style={actionIconStyle} />
        </button>
      );
      infoPanel = (
        <div className={infoPanelClass}>
          {skinConfig.startScreen.showTitle ? titleMetadata : null}
          {skinConfig.startScreen.showDescription ? descriptionMetadata : null}
        </div>
      );
    }

    return (
      <div className="oo-state-screen oo-start-screen">
        <div className={stateScreenPosterClass} style={posterStyle}>
          <div className="oo-start-screen-linear-gradient" />
          <a // eslint-disable-line
            className="oo-state-screen-selectable"
            onClick={this.handleClick}
          />
        </div>
        <Watermark {...this.props} controlBarVisible={false} />
        {infoPanel}
        {(playButtonClicked
          && controller.state.playerState === CONSTANTS.STATE.START)
        || controller.state.buffering
        || showSpinner ? (
          <Spinner loadingImage={skinConfig.general.loadingImage.imageResource.url} />
          ) : (
            actionIcon
          )}
      </div>
    );
  }
}

StartScreen.propTypes = {
  isInitializing: PropTypes.bool,
  skinConfig: PropTypes.shape({
    startScreen: PropTypes.shape({
      playIconStyle: PropTypes.shape({
        color: PropTypes.string,
      }),
    }),
    icons: PropTypes.objectOf(PropTypes.object),
  }),
  showSpinner: PropTypes.bool,
  controller: PropTypes.shape({
    togglePlayPause: PropTypes.func,
    state: PropTypes.shape({
      playerState: PropTypes.string,
      buffering: PropTypes.bool,
    }),
  }),
  contentTree: PropTypes.shape({
    promo_image: PropTypes.string,
    description: PropTypes.string,
    title: PropTypes.string,
  }),
};

StartScreen.defaultProps = {
  isInitializing: false,
  skinConfig: {
    general: {
      loadingImage: {
        imageResource: {
          url: null,
        },
      },
    },
    startScreen: {
      titleFont: {},
      descriptionFont: {},
      playIconStyle: {
        color: 'white',
      },
      infoPanelPosition: 'topLeft',
      playButtonPosition: 'center',
      showPlayButton: true,
      showPromo: true,
      showTitle: true,
      showDescription: true,
      promoImageSize: 'default',
    },
    icons: {
      play: { fontStyleClass: 'oo-icon oo-icon-play' },
      replay: { fontStyleClass: 'oo-icon oo-icon-upnext-replay' },
    },
  },
  controller: {
    togglePlayPause: () => {},
    state: {
      playerState: 'start',
      buffering: false,
    },
  },
  contentTree: {
    promo_image: '',
    description: '',
    title: '',
  },
  showSpinner: false,
};

module.exports = StartScreen;
