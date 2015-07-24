/********************************************************************
  UP NEXT PANEL
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class UpNextPanel
* @constructor
*/

var UpNextPanel = React.createClass({
  handleDismissButtonClick: function(event) {
    console.log("Up next panel dismiss button clicked");
    event.stopPropagation(); // W3C
    event.cancelBubble = true; // IE
    this.props.controller.upNextDismissButtonClicked();
  },

  handleStartUpNextClick: function(event) {
    console.log("Up next panel start button clicked");
    event.stopPropagation(); // W3C
    event.cancelBubble = true; // IE

    // Use the same way as sending out the click event on discovery content
    var eventData = {
          "clickedVideo" : this.props.upNextInfo.upNextData,
          "custom" : {"source": "upNextScreen", 
                      "countdown": 0,
                      "autoplay": true }
        };
    this.props.controller.sendDiscoveryClickEvent(eventData);
  },

  render: function() {
    var panelStyle = upNextPanelStyle.panelStyle;
    panelStyle.bottom = (this.props.controlBarVisible ? this.props.skinConfig.controlBar.height : 0);

    var contentImageContainerStyle = upNextPanelStyle.contentImageContainer;
    var contentImageStyle = upNextPanelStyle.contentImage;

    var playButtonClass = upNextPanelStyle.playButton.icon;
    var playButtonStyle = upNextPanelStyle.playButton.style;

    var contentMetadataContainerStyle = upNextPanelStyle.contentMetadataContainer;
    
    var upNextTitleStyle = upNextPanelStyle.upNextTitle;

    var upNextTitleTextStyle = upNextPanelStyle.upNextTitleText;
    var contentTile = this.props.upNextInfo.upNextData.name;

    var contentDescriptionStyle = upNextPanelStyle.contentDescription;
    var contentDescription = this.props.upNextInfo.upNextData.description;
    
    var dismissButtonStyle = upNextPanelStyle.dismissButton;
    var dismissButtonTextStyle = upNextPanelStyle.dismissButtonText;

    return (
      <div style={panelStyle}>
        <div style={contentImageContainerStyle} onClick={this.handleStartUpNextClick}>
          <img style={contentImageStyle} src={this.props.upNextInfo.upNextData.preview_image_url}></img>          
          <span className={playButtonClass} style={playButtonStyle} aria-hidden="true" onClick={this.handleClick}></span>
        </div>

        <div style={contentMetadataContainerStyle}>
          <div style={upNextTitleStyle}>
            <div style={upNextTitleTextStyle}>
              Up Next: {contentTile}
            </div>

            <CountDownClock {...this.props} timeToShow={this.props.skinConfig.upNextScreen.timeToShow}/>

          </div>

          <div style={contentDescriptionStyle}>
            {contentDescription}
          </div>
        </div>

        <div style={dismissButtonStyle} onClick={this.handleDismissButtonClick}>
          <div style={dismissButtonTextStyle}>
           Dismiss
          </div>
        </div>

      </div>
    );
  }
});