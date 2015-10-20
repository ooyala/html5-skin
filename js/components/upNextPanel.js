/********************************************************************
  UP NEXT PANEL
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class UpNextPanel
* @constructor
*/
var React = require('react'),
    CONSTANTS = require('./../constants/constants'),
    Utils = require('./utils'),
    InlineStyle = require('../styles/inlineStyle'),
    CountDownClock = require('./countDownClock');

var UpNextPanel = React.createClass({
  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    return {
      contentDescription: this.props.upNextInfo.upNextData.description
    };
  },

  componentDidMount: function() {
    var descriptionNode = this.refs.ContentDescription.getDOMNode();
    var shortDesc = Utils.truncateTextToWidth(descriptionNode, this.state.contentDescription);
    this.setState({contentDescription: shortDesc});

    if (Utils.isSafari()){
     InlineStyle.upNextPanelStyle.upNextTitleStyle.display = "-webkit-flex";
    }
    else {
     InlineStyle.upNextPanelStyle.upNextTitleStyle.display = "flex";
    }
  },

  closeUpNextPanel: function(event) {
    if (event.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      console.log("Up next panel close button clicked");
      event.stopPropagation(); // W3C
      event.cancelBubble = true; // IE
      this.props.controller.upNextDismissButtonClicked();
    }
  },

  handleStartUpNextClick: function(event) {
    if (event.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      console.log("Up next panel start button clicked");
      event.stopPropagation(); // W3C
      event.cancelBubble = true; // IE

      // Use the same way as sending out the click event on discovery content
      var eventData = {
            "clickedVideo" : this.props.upNextInfo.upNextData,
            "custom" : {"source": CONSTANTS.SCREEN.UP_NEXT_SCREEN,
                        "countdown": 0,
                        "autoplay": true }
          };
      this.props.controller.sendDiscoveryClickEvent(eventData, false);
    }
  },

  handleUpNextPanelClick: function(event) {
    event.stopPropagation(); // W3C
    event.cancelBubble = true; // IE

    this.props.controller.state.accessibilityControlsEnabled = true;
  },

  highlight: function(evt) {
    Utils.highlight(evt.target);
  },

  removeHighlight: function(evt) {
    var opacity = "0.6";
    Utils.removeHighlight(evt.target, opacity);
  },

  render: function() {
    var panelStyle = InlineStyle.upNextPanelStyle.panelStyle;

    var controlBarHeight = 60;
    panelStyle.bottom = (this.props.controlBarVisible ? controlBarHeight : 0);

    var contentImageContainerStyle = InlineStyle.upNextPanelStyle.contentImageContainerStyle;
    var contentImageStyle = InlineStyle.upNextPanelStyle.contentImageStyle;

    var playButtonClass = this.props.skinConfig.icons.play.fontStyleClass;
    var playButtonStyle = InlineStyle.upNextPanelStyle.playButton.style;

    var contentMetadataContainerStyle = InlineStyle.upNextPanelStyle.contentMetadataContainerStyle;

    var upNextTitleStyle = InlineStyle.upNextPanelStyle.upNextTitleStyle;

    var upNextTitleTextStyle = InlineStyle.upNextPanelStyle.upNextTitleTextStyle;

    var contentTile = this.props.upNextInfo.upNextData.name;
    var upNextString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.UP_NEXT, this.props.localizableStrings);

    var contentDescriptionStyle = InlineStyle.upNextPanelStyle.contentDescriptionStyle;

    var dismissButtonStyle = InlineStyle.upNextPanelStyle.dismissButtonStyle;
    var dismissButtonTextStyle = InlineStyle.upNextPanelStyle.dismissButtonTextStyle;

    return (
      <div className="upNextPanel" style={panelStyle} onClick={this.handleUpNextPanelClick} onTouchEnd={this.handleUpNextPanelClick}>
        <div className="upNextContent" style={contentImageContainerStyle} onClick={this.handleStartUpNextClick} onTouchEnd={this.handleStartUpNextClick}>
          <img style={contentImageStyle} src={this.props.upNextInfo.upNextData.preview_image_url}></img>
          <span className={playButtonClass} style={playButtonStyle} aria-hidden="true"></span>
        </div>

        <div className="contentMetadata" style={contentMetadataContainerStyle}>
          <div style={upNextTitleStyle}>
            <CountDownClock {...this.props} timeToShow={this.props.skinConfig.upNextScreen.timeToShow} currentPlayhead={this.props.currentPlayhead}/>

            <div style={upNextTitleTextStyle}>
              {upNextString}: {contentTile}
            </div>
          </div>

          <div ref="ContentDescription" style={contentDescriptionStyle}>
            {this.state.contentDescription}
          </div>
        </div>

        <div className="close" onMouseOver={this.highlight} onMouseOut={this.removeHighlight}
          onClick={this.closeUpNextPanel} style={InlineStyle.upNextPanelStyle.closeButton} onTouchEnd={this.closeUpNextPanel}>
          <span className={this.props.skinConfig.icons.dismiss.fontStyleClass} style={InlineStyle.defaultScreenStyle.closeButtonStyle}></span>
        </div>
      </div>
    );
  }
});
module.exports = UpNextPanel;