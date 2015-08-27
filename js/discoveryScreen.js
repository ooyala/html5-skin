/********************************************************************
  DISCOVERY SCREEN
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class DiscoveryScreen
* @constructor
*/
var DiscoveryScreen = React.createClass({
  getInitialState: function() {
    return {
      controlBarVisible: true,
      controlBarWidth: 0
    };
  },

  componentDidMount: function () {
    this.setState({controlBarWidth: this.getDOMNode().clientWidth - 2 * UI.DEFAULT_SCRUBBERBAR_LEFT_RIGHT_PADDING});
    // Make sure component resize correctly after switch to fullscreen/inline screen
    window.addEventListener('resize', this.handleResize);
  },

  handleResize: function(e) {
    if (this.isMounted()) {
      this.setState({controlBarWidth: this.getDOMNode().clientWidth});
    }
  },

  render: function() {
    var promoStyle = discoveryScreenStyle.promoStyle;
    if(this.props.playerState === STATE.END) {
      promoStyle.visibility = "visible";
    }
    else {
      promoStyle.visibility = "hidden";
    }
    promoStyle.backgroundImage = "url('" + this.props.contentTree.promo_image + "')";
    return (
      <div className="discoveryScreen" onMouseOver={this.showControlBar} onMouseOut={this.hideControlBar} onMouseUp={this.handlePlayerMouseUp} style={{height: "100%", width: "100%"}}>
        <div style={discoveryScreenStyle.promoStyle}></div>
        <DiscoveryPanel
          {...this.props}
          discoveryData={this.props.discoveryData} />

        <ScrubberBar
          {...this.props}
          controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} />

        <ControlBar
          {...this.props}
          controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth}
          playerState={this.props.playerState} />
      </div>
    );
  }
});