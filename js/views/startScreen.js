/********************************************************************
 START SCREEN
 *********************************************************************/
var React = require('react'),
    ReactDOM = require('react-dom'),
    ClassNames = require('classnames'),
    CONSTANTS = require('../constants/constants'),
    Spinner = require('../components/spinner'),
    Icon = require('../components/icon'),
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

  handleResize: function() {
    this.setState({
      descriptionText: Utils.truncateTextToWidth(ReactDOM.findDOMNode(this.refs.description), this.props.contentTree.description)
    });
  },

  handleClick: function(event) {
    event.preventDefault();
    this.props.controller.togglePlayPause();
    this.props.controller.state.accessibilityControlsEnabled = true;
    this.setState({playButtonClicked: true});
  },

  render: function() {
    //inline style for config/skin.json elements only
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
    actionIconStyle.fontFamily = this.props.controller.state.playerState == CONSTANTS.STATE.END ?
      this.props.skinConfig.icons.replay.fontFamilyName : this.props.skinConfig.icons.play.fontFamilyName;
    var posterImageUrl = this.props.skinConfig.startScreen.showPromo ? this.props.contentTree.promo_image : '';
    var posterStyle = {
      backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 100%), url('" + posterImageUrl + "')"
    };

    //CSS class manipulation from config/skin.json
    var stateScreenPosterClass = ClassNames({
      'state-screen-poster': this.props.skinConfig.startScreen.promoImageSize != "small",
      'state-screen-poster-small': this.props.skinConfig.startScreen.promoImageSize == "small"
    });
    var infoPanelClass = ClassNames({
      'state-screen-info': true,
      'info-panel-top': this.props.skinConfig.startScreen.infoPanelPosition.toLowerCase().indexOf("top") > -1,
      'info-panel-bottom': this.props.skinConfig.startScreen.infoPanelPosition.toLowerCase().indexOf("bottom") > -1,
      'info-panel-left': this.props.skinConfig.startScreen.infoPanelPosition.toLowerCase().indexOf("left") > -1,
      'info-panel-right': this.props.skinConfig.startScreen.infoPanelPosition.toLowerCase().indexOf("right") > -1
    });
    var titleClass = ClassNames({
      'state-screen-title': true,
      'text-truncate': true,
      'text-capitalize': true,
      'pull-right': this.props.skinConfig.startScreen.infoPanelPosition.toLowerCase().indexOf("right") > -1
    });
    var descriptionClass = ClassNames({
      'state-screen-description': true,
      'pull-right': this.props.skinConfig.startScreen.infoPanelPosition.toLowerCase().indexOf("right") > -1
    });
    var actionIconClass = ClassNames({
      'action-icon': true,
      'action-icon-top': this.props.skinConfig.startScreen.playButtonPosition.toLowerCase().indexOf("top") > -1,
      'action-icon-bottom': this.props.skinConfig.startScreen.playButtonPosition.toLowerCase().indexOf("bottom") > -1,
      'action-icon-left': this.props.skinConfig.startScreen.playButtonPosition.toLowerCase().indexOf("left") > -1,
      'action-icon-right': this.props.skinConfig.startScreen.playButtonPosition.toLowerCase().indexOf("right") > -1,
      'hidden': !this.props.skinConfig.startScreen.showPlayButton
    });

    var titleMetadata = (<div className={titleClass} style={titleStyle}>{this.props.contentTree.title}</div>);
    var iconName = (this.props.controller.state.playerState == CONSTANTS.STATE.END ? "replay" : "play");
    var descriptionMetadata = (<div className={descriptionClass} ref="description" style={descriptionStyle}>{this.state.descriptionText}</div>);

    var actionIcon = (
      <a className={actionIconClass} onClick={this.handleClick}>
        <Icon {...this.props} icon={iconName}/>
      </a>
    );
    return (
      <div className="state-screen startScreen">
        <div className={stateScreenPosterClass} style={posterStyle}>
          <a className="state-screen-selectable" onClick={this.handleClick}></a>
        </div>
        <div className={infoPanelClass}>
          {this.props.skinConfig.startScreen.showTitle ? titleMetadata : null} Dave
          {this.props.skinConfig.startScreen.showDescription ? descriptionMetadata : null}
        </div>

        {(this.state.playButtonClicked && this.props.controller.state.playerState == CONSTANTS.STATE.START) || this.props.controller.state.buffering ?
          <Spinner loadingImage={this.props.skinConfig.general.loadingImage.imageResource.url}/> : actionIcon}
      </div>
    );
  }
});

StartScreen.propTypes = {
  skinConfig: React.PropTypes.shape({
    startScreen: React.PropTypes.shape({
      playIconStyle: React.PropTypes.shape({
        color: React.PropTypes.string
      })
    }),
    icons: React.PropTypes.objectOf(React.PropTypes.object)
  })
};

StartScreen.defaultProps = {
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
      play:{fontStyleClass:'icon icon-play'},
      replay:{fontStyleClass:'icon icon-upnext-replay'}
    }
  },
  controller: {
    togglePlayPause: function(){},
    state: {
      playerState:'start',
      buffering: false
    }
  },
  contentTree: {
    promo_image: '',
    description:'',
    title:''
  }
};

module.exports = StartScreen;