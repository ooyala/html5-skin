/********************************************************************
  AD PANEL
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class AdPanel
* @constructor
*/

var AdPanel = React.createClass({
  componentDidMount: function(){
    if (Utils.isSafari()){
      adScreenStyle.topBarStyle.display = "-webkit-flex";
    }
    else {
      adScreenStyle.topBarStyle.display = "flex";
    }
  },

  handleLearnMoreButtonClick: function(event) {
    console.log("Learn more button clicked");
    event.stopPropagation(); // W3C
    event.cancelBubble = true; // IE
    this.props.controller.onAdsClicked();
  },

  populateAdTopBar: function() {
    var adTopBarItems = [];

    // Ad title
    var adTitle = this.props.currentAdsInfo.currentAdItem.name;
    // AMC puts "Unknown" in the name field if ad name unavailable 
    if (adTitle !== "Unknown" && this.props.controlBarWidth > 560) {      
      var adTitleDiv = {
        "adTitle" : <div className="adTitle" style={adScreenStyle.adPanelTopBarTextStyle}>
          {adTitle}
        </div>
      };
      adTopBarItems.push(adTitleDiv.adTitle);
    }
    
    // Ad playback Info
    var currentAdIndex = this.props.currentAdsInfo.currentAdItem.indexInPod;
    var totalNumberOfAds = this.props.currentAdsInfo.numberOfAds;
    var remainingTime = Utils.formatSeconds(parseInt(this.props.currentAdsInfo.currentAdItem.duration -  this.props.currentPlayhead));
    var adPlaybackInfo = "Ad: (" + currentAdIndex + "/" + totalNumberOfAds + ") - " + remainingTime;

    var adPlaybackInfoDiv = {
      "adPlaybackInfo" : <div className="adPlaybackInfo" style={adScreenStyle.adPanelTopBarTextStyle}>
        {adPlaybackInfo}
      </div>
    };
    adTopBarItems.push(adPlaybackInfoDiv.adPlaybackInfo);  

    // Flexible space 
    var flexibleSpaceDiv = {
      "flexibleSpace" : <div className="flexibleSpace" style={controlBarStyle.flexibleSpace}></div>
    };
    adTopBarItems.push(flexibleSpaceDiv.flexibleSpace);

    // Learn more
    if (this.props.currentAdsInfo.currentAdItem !== null && 
        this.props.currentAdsInfo.currentAdItem.clickUrl !== "") {
      var learnMoreText = "Learn More";
      var learMoreButtonDiv = {
        "learnMoreButton" : <div className="learnMoreButton" style={adScreenStyle.learnMoreButtonStyle} onClick={this.handleLearnMoreButtonClick}>
             {learnMoreText}
          </div>  
      };
      adTopBarItems.push(learMoreButtonDiv.learnMoreButton);
    }

    // Skip
    if (this.props.currentAdsInfo.currentAdItem.skippable) {
      var skipButtonText = "Skip Ad";
      var skipButtonDiv = {
        "skipButton" : <div className="skipButton" style={adScreenStyle.skipButtonStyle}>
            {skipButtonText}
          </div>
      };
      adTopBarItems.push(skipButtonDiv.skipButton);
    }
    return adTopBarItems;
  },

  render: function() {
    var adTopBarItems = this.populateAdTopBar();
    return (
      <div style={adScreenStyle.panelStyle}>
        <div style={adScreenStyle.topBarStyle}>
          {adTopBarItems}
        </div>
      </div>
    );
  }
});