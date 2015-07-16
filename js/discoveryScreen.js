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
      controlBarVisible: true
    };
  },

  componentDidMount: function () {
    this.setState({controlBarWidth: this.getDOMNode().clientWidth});
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
      <div onMouseOver={this.showControlBar} onMouseOut={this.hideControlBar} onMouseUp={this.handlePlayerMouseUp} style={{height: "100%", width: "100%"}}>
        <div style={discoveryScreenStyle.promoStyle}></div>
        <DiscoveryPanel 
          {...this.props} 
          discoveryData={this.props.discoveryData} 
          controlBarVisible={this.state.controlBarVisible} />
        
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