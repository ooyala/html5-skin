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
    // AMC puts "Unknown" in the name field if ad name unavailable 
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
    console.log("xenia in AdPanel");

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