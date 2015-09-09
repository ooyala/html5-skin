/********************************************************************
  AD OVERLAY
*********************************************************************/
var React = require('react'),
    InlineStyle = require('../styles/inlineStyle');

var AdOverlay = React.createClass({
  render: function() {
  	overlayStyle = InlineStyle.adOverlayStyle.style;
  	var scrubberPaddingHeight = parseInt(InlineStyle.scrubberBarStyle.scrubberBarPadding.height);
  	var scrubberBarHeight = parseInt(InlineStyle.scrubberBarStyle.scrubberBarSetting.height);
  	var controlBarHeight = InlineStyle.controlBarStyle.controlBarSetting.height;
  	if(this.props.overlay && this.props.showOverlay) {
      overlayStyle.display = "inline-block";
      overlayStyle.bottom = this.props.controlBarVisible ?
      controlBarHeight + scrubberPaddingHeight/2 : scrubberPaddingHeight/2;
      //controlBarHeight - (scrubberPaddingHeight) : scrubberBarHeight - (scrubberPaddingHeight / 2);
  	}
  	else {
      overlayStyle.display = "none";
  	}
  	return (
  	  <div className="adOverlay" style={overlayStyle}>
        <img src={this.props.overlay}></img>
      </div>
    );
  }
});
module.exports = AdOverlay;