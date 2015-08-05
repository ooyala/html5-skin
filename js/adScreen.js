/********************************************************************
  AD SCREEN
*********************************************************************/

var AdScreen = React.createClass({
  getInitialState: function() {
    return {
      controlBarVisible: true,
      controlBarWidth: 0
    };
  },

  componentDidMount: function () {
    this.setState({controlBarWidth: this.getDOMNode().clientWidth});

    // Make sure component resize correctly after switch to fullscreen/inline screen
    window.addEventListener('resize', this.handleResize);
  },

  handleResize: function(e) {
    if (this.isMounted()) {
      this.setState({controlBarWidth: this.getDOMNode().clientWidth});
    }
  },

  handlePlayerClicked: function() {    
    console.log("ad screen clicked");
    event.stopPropagation(); // W3C
    event.cancelBubble = true; // IE
    this.props.controller.onAdsClicked();
  },

  showControlBar: function() {
    this.setState({controlBarVisible: true});
  },

  hideControlBar: function() {
    this.setState({controlBarVisible: false});
  },

  render: function() {
    var adPanel = null;
    if (this.props.skinConfig.adScreen.showAdMarquee) {
      adPanel = <AdPanel {...this.props} controlBarWidth={this.state.controlBarWidth}/>;
    }
    return (
      <div onMouseOver={this.showControlBar} onMouseOut={this.hideControlBar}
        onClick={this.handlePlayerClicked} style={defaultScreenStyle.style}>
        
        {adPanel}

        <ScrubberBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} />
        
        <ControlBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth}
          playerState={this.props.playerState} />
      </div>
    );
  }
});