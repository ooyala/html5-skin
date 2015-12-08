/********************************************************************
 START SCREEN
 *********************************************************************/
var React = require('react'),
    ClassNames = require('classnames'),
    CONSTANTS = require('../constants/constants'),
    Spinner = require('../components/spinner'),
    TruncateTextMixin = require('../mixins/truncateTextMixin');

var StartScreen = React.createClass({
  mixins: [TruncateTextMixin],

  propTypes: {
    skinConfig: React.PropTypes.shape({
      startScreen: React.PropTypes.shape({
        titleFont: React.PropTypes.shape({
          fontSize: React.PropTypes.number
        }),
        descriptionFont: React.PropTypes.shape({
          fontSize: React.PropTypes.number
        }),
        playIconStyle: React.PropTypes.shape({
          color: React.PropTypes.string
        })
      }),
      icons: React.PropTypes.objectOf(React.PropTypes.object)
    })
  },

  getDefaultProps: function () {
    return {
      skinConfig: {
        startScreen: {
          titleFont: {
            fontSize: 30
          },
          descriptionFont: {
            fontSize: 17
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
  },

  componentDidMount: function() {
    this.truncateText(this.refs.description, this.props.contentTree.description);
  },

  handleClick: function(event) {
    event.preventDefault();
    this.props.controller.togglePlayPause();
    this.props.controller.state.accessibilityControlsEnabled = true;
  },

  render: function() {
    //inline style for config/skin.json elements only
    var titleStyle = {
      //fontSize: this.props.skinConfig.startScreen.titleFont.fontSize + "pt",
      //fontFamily: this.props.skinConfig.startScreen.titleFont.fontFamily,
      color: this.props.skinConfig.startScreen.titleFont.color
    };
    var descriptionStyle = {
      //fontSize: this.props.skinConfig.startScreen.descriptionFont.fontSize + "pt",
      //fontFamily: this.props.skinConfig.startScreen.descriptionFont.fontFamily,
      color: this.props.skinConfig.startScreen.descriptionFont.color
    };
    var actionIconStyle = {
      color: this.props.skinConfig.startScreen.playIconStyle.color,
      opacity: this.props.skinConfig.startScreen.playIconStyle.opacity
    };
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
    var descriptionMetadata = (<div className={descriptionClass} ref="description" style={descriptionStyle}>{this.props.contentTree.description}</div>);
    var actionIcon = (
      <a className={actionIconClass} onClick={this.handleClick}>
        <span className={this.props.controller.state.playerState == CONSTANTS.STATE.END ? this.props.skinConfig.icons.replay.fontStyleClass : this.props.skinConfig.icons.play.fontStyleClass}
              style={actionIconStyle}
              aria-hidden="true"></span>
      </a>
    );

    return (
        <div className="state-screen">
          <div className={stateScreenPosterClass} style={posterStyle}></div>
          <div className={infoPanelClass}>
            {this.props.skinConfig.startScreen.showTitle ? titleMetadata : ''}
            {this.props.skinConfig.startScreen.showDescription ? descriptionMetadata : ''}
          </div>

          <a className="state-screen-selectable" onClick={this.handleClick}></a>

          {this.props.controller.state.buffering ? <Spinner /> : actionIcon}
        </div>
    );
  }
});
module.exports = StartScreen;