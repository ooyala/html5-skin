/** ******************************************************************
 START SCREEN
 *********************************************************************/
var React = require('react'),
    ReactDOM = require('react-dom'),
    ClassNames = require('classnames'),
    CONSTANTS = require('../constants/constants'),
    Spinner = require('../components/spinner'),
    Icon = require('../components/icon'),
    Watermark = require('../components/watermark'),
    ResizeMixin = require('../mixins/resizeMixin'),
    Utils = require('../components/utils');

var StartScreen = React.createClass({
  mixins: [ResizeMixin],

  getInitialState: function() {
    return {
      playButtonClicked: false,
      descriptionText: this.props.contentTree.description
    };
  },

  componentDidMount: function() {
    this.handleResize();
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.contentTree.description != this.props.contentTree.description) {
      this.handleResize(nextProps);
    }
  },

  handleResize: function(nextProps) {
    var description = nextProps ? nextProps.contentTree.description : this.props.contentTree.description;
    if (ReactDOM.findDOMNode(this.refs.description)) {
      this.setState({
        descriptionText: Utils.truncateTextToWidth(ReactDOM.findDOMNode(this.refs.description), description)
      });
    }
  },

  handleClick: function(event) {
    // Avoid starting playback when player is initializing (play button is disabled
    // in this state, but you can still click on the thumbnail)
    if (!this.props.isInitializing) {
      event.preventDefault();
      this.props.controller.togglePlayPause();
      this.props.controller.state.accessibilityControlsEnabled = true;
      this.setState({playButtonClicked: true});
    }
  },

  render: function() {
    // inline style for config/skin.json elements only
    var titleStyle = {
      color: this.props.skinConfig.startScreen.titleFont.color
    };
    var descriptionStyle = {
      color: this.props.skinConfig.startScreen.descriptionFont.color
    };
    var actionIconStyle = {
      color: this.props.skinConfig.startScreen.playIconStyle.color,
      opacity: this.props.skinConfig.startScreen.playIconStyle.opacity
    };
    var posterImageUrl = this.props.skinConfig.startScreen.showPromo ? this.props.contentTree.promo_image : '';
    var posterStyle = {};
    if (Utils.isValidString(posterImageUrl)) {
      posterStyle.backgroundImage = 'url(\'' + posterImageUrl + '\')';
    }

    // CSS class manipulation from config/skin.json
    var stateScreenPosterClass = ClassNames({
      'oo-state-screen-poster': this.props.skinConfig.startScreen.promoImageSize != 'small',
      'oo-state-screen-poster-small': this.props.skinConfig.startScreen.promoImageSize == 'small'
    });
    var infoPanelClass = ClassNames({
      'oo-state-screen-info': true,
      'oo-info-panel-top': this.props.skinConfig.startScreen.infoPanelPosition.toLowerCase().indexOf('top') > -1,
      'oo-info-panel-bottom': this.props.skinConfig.startScreen.infoPanelPosition.toLowerCase().indexOf('bottom') > -1,
      'oo-info-panel-left': this.props.skinConfig.startScreen.infoPanelPosition.toLowerCase().indexOf('left') > -1,
      'oo-info-panel-right': this.props.skinConfig.startScreen.infoPanelPosition.toLowerCase().indexOf('right') > -1
    });
    var titleClass = ClassNames({
      'oo-state-screen-title': true,
      'oo-text-truncate': true,
      'oo-pull-right': this.props.skinConfig.startScreen.infoPanelPosition.toLowerCase().indexOf('right') > -1
    });
    var descriptionClass = ClassNames({
      'oo-state-screen-description': true,
      'oo-pull-right': this.props.skinConfig.startScreen.infoPanelPosition.toLowerCase().indexOf('right') > -1
    });
    var actionIconClass = ClassNames({
      'oo-action-icon': true,
      'oo-action-icon-top': this.props.skinConfig.startScreen.playButtonPosition.toLowerCase().indexOf('top') > -1,
      'oo-action-icon-bottom': this.props.skinConfig.startScreen.playButtonPosition.toLowerCase().indexOf('bottom') > -1,
      'oo-action-icon-left': this.props.skinConfig.startScreen.playButtonPosition.toLowerCase().indexOf('left') > -1,
      'oo-action-icon-right': this.props.skinConfig.startScreen.playButtonPosition.toLowerCase().indexOf('right') > -1,
      'oo-hidden': !this.props.skinConfig.startScreen.showPlayButton
    });

    var titleMetadata = (<div className={titleClass} style={titleStyle}>{this.props.contentTree.title}</div>);
    var iconName = (this.props.controller.state.playerState == CONSTANTS.STATE.END ? 'replay' : 'play');
    // The descriptionText value doesn't react to changes in contentTree.description since
    // it's being handled as internal state in order to allow truncating it on player resize.
    // We need to migrate truncateTextToWidth to a CSS solution in order to avoid this.
    var descriptionMetadata = (
      <div className={descriptionClass} ref="description" style={descriptionStyle}>
        {this.state.descriptionText || this.props.contentTree.description}
      </div>
    );

    var actionIcon, infoPanel;
    // We do not show the action icon, title or description when the player is initializing
    if (!this.props.isInitializing) {
      actionIcon = (
        <button
          type="button"
          className={actionIconClass}
          onMouseUp={Utils.blurOnMouseUp}
          onClick={this.handleClick}
          tabIndex="0"
          aria-label={CONSTANTS.ARIA_LABELS.START_PLAYBACK}>
          <Icon {...this.props} icon={iconName} style={actionIconStyle}/>
        </button>
      );
      infoPanel = (
        <div className={infoPanelClass}>
          {this.props.skinConfig.startScreen.showTitle ? titleMetadata : null}
          {this.props.skinConfig.startScreen.showDescription ? descriptionMetadata : null}
        </div>
      );
    }

    return (
      <div className="oo-state-screen oo-start-screen">
        <div className={stateScreenPosterClass} style={posterStyle}>
          <div className="oo-start-screen-linear-gradient"></div>
          <a className="oo-state-screen-selectable" onClick={this.handleClick}></a>
        </div>
        <Watermark {...this.props} controlBarVisible={false}/>
        {infoPanel}
        {(this.state.playButtonClicked && this.props.controller.state.playerState == CONSTANTS.STATE.START) || this.props.controller.state.buffering || this.props.showSpinner ?
          <Spinner loadingImage={this.props.skinConfig.general.loadingImage.imageResource.url}/> : actionIcon}
      </div>
    );
  }
});

StartScreen.propTypes = {
  isInitializing: React.PropTypes.bool,
  skinConfig: React.PropTypes.shape({
    startScreen: React.PropTypes.shape({
      playIconStyle: React.PropTypes.shape({
        color: React.PropTypes.string
      })
    }),
    icons: React.PropTypes.objectOf(React.PropTypes.object)
  }),
  showSpinner: React.PropTypes.bool
};

StartScreen.defaultProps = {
  isInitializing: false,
  skinConfig: {
    general: {
      loadingImage: {
        imageResource: {
          url: null
        }
      }
    },
    startScreen: {
      titleFont: {
      },
      descriptionFont: {
      },
      playIconStyle: {
        color: 'white'
      },
      infoPanelPosition: 'topLeft',
      playButtonPosition: 'center',
      showPlayButton: true,
      showPromo: true,
      showTitle: true,
      showDescription: true,
      promoImageSize: 'default'
    },
    icons: {
      play:{fontStyleClass:'oo-icon oo-icon-play'},
      replay:{fontStyleClass:'oo-icon oo-icon-upnext-replay'}
    }
  },
  controller: {
    togglePlayPause: function() {},
    state: {
      playerState:'start',
      buffering: false
    }
  },
  contentTree: {
    promo_image: '',
    description:'',
    title:''
  },
  showSpinner: false
};

module.exports = StartScreen;
