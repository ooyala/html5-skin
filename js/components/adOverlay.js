/********************************************************************
  AD OVERLAY
*********************************************************************/
var AdOverlay = React.createClass({
  render: function() {
  	overlayStyle = adOverlayStyle.style;
  	var scrubberPaddingHeight = parseInt(scrubberBarStyle.scrubberBarPadding.height);
  	var scrubberBarHeight = parseInt(scrubberBarStyle.scrubberBarSetting.height);
  	var controlBarHeight = controlBarStyle.controlBarSetting.height;
  	if(this.props.overlay) {
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