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

  getPlaybackControlItems: function() {
    var playbackControlItems = [];
    var scrubberBar = {
      "scrubberBar": <ScrubberBar {...this.props} controlBarVisible={this.state.controlBarVisible}
        controlBarWidth={this.state.controlBarWidth} />
    };
    playbackControlItems.push(scrubberBar);
    var controlBar = {
      "controlBar": <ControlBar {...this.props} controlBarVisible={this.state.controlBarVisible}
        controlBarWidth={this.state.controlBarWidth}
        playerState={this.props.playerState} />
    };
    playbackControlItems.push(controlBar);
    return playbackControlItems;
  },

  render: function() {
    var adPanel = null;
    if (this.props.skinConfig.adScreen.showAdMarquee) {
      adPanel = <AdPanel {...this.props} controlBarWidth={this.state.controlBarWidth}/>;
    }
    var playbackControlItems = null;
    if(this.props.skinConfig.adScreen.showControlBar) {
      playbackControlItems = this.getPlaybackControlItems();
    }
    return (
      <div onMouseOver={this.showControlBar} onMouseOut={this.hideControlBar}
        onClick={this.handlePlayerClicked} style={defaultScreenStyle.style}>
        
        {adPanel}

        {playbackControlItems}
      </div>
    );
  }
});