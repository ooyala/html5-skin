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
  getInitialState: function() {
    return {
    };
  },

  handleLearnMoreButtonClick: function() {
    var clickThroughUrl = this.props.currentAdsInfo.currentAdItem.clickUrl;
    this.openUrl(clickThroughUrl);
  },

  openUrl: function(url) {
    if (url === null) { 
      return; 
    }
    window.open(url);
  },

  render: function() {
    var currentAdIndex = this.props.currentAdsInfo.currentAdItem.indexInPod;
    var totalNumberOfAds = this.props.currentAdsInfo.numberOfAds;

    var panelStyle = adScreenStyle.panelStyle;

    var topBarStyle = adScreenStyle.topBarStyle;
    var adPlaybackInfoTextStyle = adScreenStyle.adPlaybackInfoTextStyle;
    if (totalNumberOfAds === 0) {
      adPlaybackInfoTextStyle.visibility = "hidden";
    }

    var topBarTitle = "Ad Playing";
    if (this.props.currentAdsInfo.currentAdItem.name !== "Unknown") {
      topBarTitle = topBarTitle + ": " + this.props.currentAdsInfo.currentAdItem.name;
    }

    var learnMoreButtonStyle = adScreenStyle.learnMoreButtonStyle;
    if (this.props.currentAdsInfo.currentAdItem !== null && 
        this.props.currentAdsInfo.currentAdItem.clickUrl === "") {
      learnMoreButtonStyle.visibility = "hidden";
    }
    var learnMoreButtonTextStyle = adScreenStyle.learnMoreButtonTextStyle;

    var skipButtonStyle = adScreenStyle.skipButtonStyle;
    if (!this.props.currentAdsInfo.currentAdItem.skippable) {
      skipButtonStyle.visibility = "hidden";
    }
    var skipButtonTextStyle = adScreenStyle.skipButtonTextStyle;

    var remainingTime = Utils.formatSeconds(parseInt(this.props.currentAdsInfo.currentAdItem.duration -  this.props.currentPlayhead));
    return (
      <div style={panelStyle}>

        <div style={topBarStyle}>
          <div style={adPlaybackInfoTextStyle}>
            {topBarTitle} ({currentAdIndex}/{totalNumberOfAds})  |   {remainingTime}
          </div>

          <div style={learnMoreButtonStyle} onClick={this.handleLearnMoreButtonClick}>
            <div style={learnMoreButtonTextStyle}>
             Learn More
            </div>
          </div>
        </div>

        <div style={skipButtonStyle}>
          <div style={skipButtonTextStyle}>
           Skip Ad
          </div>
        </div>

      </div>
    );
  }
});