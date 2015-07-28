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
  getInitialState: function() {
    return {
      contentDescription: this.props.upNextInfo.upNextData.description
    };
  },

  componentDidMount: function() {
    var descriptionNode = this.getDOMNode().getElementsByClassName("content-description")[0];
    var shortDesc = Utils.truncateTextToWidth(descriptionNode, this.state.contentDescription);
    this.setState({contentDescription: shortDesc});
  },

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
    panelStyle.bottom = bottom = (this.props.controlBarVisible ? this.props.controlBarHeight : 0);

    var contentImageContainerStyle = upNextPanelStyle.contentImageContainerStyle;
    var contentImageStyle = upNextPanelStyle.contentImageStyle;

    var playButtonClass = upNextPanelStyle.playButton.icon;
    var playButtonStyle = upNextPanelStyle.playButton.style;

    var contentMetadataContainerStyle = upNextPanelStyle.contentMetadataContainerStyle;
    
    var upNextTitleStyle = upNextPanelStyle.upNextTitleStyle;

    var upNextTitleTextStyle = upNextPanelStyle.upNextTitleTextStyle;
    var contentTile = this.props.upNextInfo.upNextData.name;

    var contentDescriptionStyle = upNextPanelStyle.contentDescriptionStyle;
    //var contentDescription = this.props.upNextInfo.upNextData.description;
    
    var dismissButtonStyle = upNextPanelStyle.dismissButtonStyle;
    var dismissButtonTextStyle = upNextPanelStyle.dismissButtonTextStyle;

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

          <div className="content-description" style={contentDescriptionStyle}>
            {this.state.contentDescription}
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