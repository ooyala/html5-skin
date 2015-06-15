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
    var clickThroughUrl = this.props.currentAdItem.click_url;
    this.openUrl(clickThroughUrl);
  },

  openUrl: function(url) {
    if (url === null) { 
      return; 
    }
    window.open(url);
  },

  isPlayingPreroll: function() {
    return (this.props.currentAdItem && this.props.currentAdItem.time < 250);
  },

  isPlayingMidroll: function() {
    return (this.props.currentAdItem && 
      !this._isPreRollAd(this.props.currentAdItem) && 
      !this._isPostRollAd(this.props.currentAdItem));
  },

  isPlayingPostroll: function() {
    return (this.props.currentAdItem && this.props.currentAdItem.time == 1000000000);
  },


  render: function() {
    var currentAdIndex = this.props.adsPlaybackProgress[this.props.currentAdItem.time].played;
    var totalNumberOfAds = this.props.adsPlaybackProgress[this.props.currentAdItem.time].total;

    var panelStyle = adScreenStyle.panelStyle;

    var topBarStyle = adScreenStyle.topBarStyle;
    var adPlaybackInfoTextStyle = adScreenStyle.adPlaybackInfoTextStyle;
    var learnMoreButtonStyle = adScreenStyle.learnMoreButtonStyle;
    var learnMoreButtonTextStyle = adScreenStyle.learnMoreButtonTextStyle;

    var skipButtonStyle = adScreenStyle.skipButtonStyle;
    var skipButtonTextStyle = adScreenStyle.skipButtonTextStyle;

  
    var remainTime = Utils.formatSeconds(parseInt(this.props.contentTree.duration / 1000 -  this.props.currentPlayhead));
    return (
      <div style={panelStyle}>

        <div style={topBarStyle}>
          <div style={adPlaybackInfoTextStyle}>
            Ad Playing: Cute Cat:) ({currentAdIndex}/{totalNumberOfAds})  |   {remainTime}
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