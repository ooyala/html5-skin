/********************************************************************
  AD SCREEN
*********************************************************************/
var React = require('react'),
    CONSTANTS = require('../constants/constants'),
    InlineStyle = require('../styles/inlineStyle'),
    AdPanel = require('../components/adPanel'),
    ControlBar = require('../components/controlBar'),
    ScrubberBar = require('../components/scrubberBar'),
    Utils = require('../components/utils');

var AdScreen = React.createClass({
  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    return {
      controlBarVisible: true,
      controlBarWidth: 0,
      timer: null
    };
  },

  componentDidMount: function () {
    this.setState({controlBarWidth: this.getDOMNode().clientWidth});

    // Make sure component resize correctly after switch to fullscreen/inline screen
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('webkitfullscreenchange', this.handleResize);
    window.addEventListener('mozfullscreenchange', this.handleResize);
    window.addEventListener('fullscreenchange', this.handleResize);
    window.addEventListener('msfullscreenchange', this.handleResize);

    //for mobile or desktop fullscreen, hide control bar after 3 seconds
    if (this.isMobile || this.props.fullscreen){
      this.startHideControlBarTimer();
    }
  },

  componentWillUnmount: function () {
    if (this.state.timer !== null) {
      clearTimeout(this.state.timer);
    }
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('webkitfullscreenchange', this.handleResize);
    window.removeEventListener('mozfullscreenchange', this.handleResize);
    window.removeEventListener('fullscreenchange', this.handleResize);
    window.removeEventListener('msfullscreenchange', this.handleResize);
  },

  componentWillUpdate: function(nextProps, nextState) {
    if(nextProps) {
      if(!this.props.fullscreen && nextProps.fullscreen && this.state.playerState != CONSTANTS.STATE.PAUSE) {
        this.startHideControlBarTimer();
      }
    }
  },

  startHideControlBarTimer: function(){
    if (this.state.timer !== null) {
      clearTimeout(this.state.timer);
    }
    var timer = setTimeout(function(){
      if(this.state.controlBarVisible){
        this.hideControlBar();
      }
    }.bind(this), 3000);
    this.setState({timer: timer});
  },

  handleResize: function(e) {
    if (this.isMounted()) {
      this.setState({controlBarWidth: this.getDOMNode().clientWidth});
    }
  },

  handleClick: function(e) {
    event.stopPropagation(); // W3C
    event.cancelBubble = true; // IE

    this.props.controller.state.accessibilityControlsEnabled = true;
  },

  handlePlayerClicked: function(event) {
    if (event.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      //since after exiting the full screen, iPhone pauses the video and places an overlay play button in the middle
      //of the screen (which we can't remove), clicking the screen would start the video.
      if (Utils.isIPhone() && this.state.playerState == CONSTANTS.STATE.PAUSE){
        this.props.controller.togglePlayPause();
      }
      else {
        event.stopPropagation(); // W3C
        event.cancelBubble = true; // IE
        this.props.controller.onAdsClicked(CONSTANTS.AD_CLICK_SOURCE.VIDEO_WINDOW);
      }
    }
  },

  showControlBar: function() {
    this.setState({controlBarVisible: true});
    this.refs.AdScreen.getDOMNode().style.cursor="auto";
  },

  hideControlBar: function() {
    this.setState({controlBarVisible: false});
    this.refs.AdScreen.getDOMNode().style.cursor="none";
  },

  handleTouchEnd: function(event) {
    if (!this.state.controlBarVisible){
      this.showControlBar();
      this.startHideControlBarTimer();
    }
    else {
      this.handlePlayerClicked(event);
    }
  },

  handlePlayerMouseMove: function() {
    if(this.props.playerState === CONSTANTS.STATE.PAUSE) {
      if (this.state.timer !== null){
        clearTimeout(this.state.timer);
      }
    }
    else if(!this.isMobile && this.props.fullscreen) {
      this.showControlBar();
      this.startHideControlBarTimer();
    }
  },

  getPlaybackControlItems: function() {
    var playbackControlItemTemplates = {
     "scrubberBar": <ScrubberBar {...this.props} controlBarVisible={this.state.controlBarVisible}
       controlBarWidth={this.state.controlBarWidth} />,

     "controlBar": <ControlBar {...this.props} controlBarVisible={this.state.controlBarVisible}
       controlBarWidth={this.state.controlBarWidth}
       playerState={this.props.playerState} />
    };

    var playbackControlItems = [];
    for(var item in playbackControlItemTemplates) {
      playbackControlItems.push(playbackControlItemTemplates[item]);
    }

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
      <div ref="AdScreen" className="adScreen" onMouseOver={this.showControlBar} onMouseOut={this.hideControlBar}
        onMouseMove={this.handlePlayerMouseMove} onMouseUp={this.handleClick} style={InlineStyle.defaultScreenStyle.style}>

        <div className="adPanel" onClick={this.handlePlayerClicked} onTouchEnd={this.handleTouchEnd}>
          {adPanel}
        </div>
        <div>
          {playbackControlItems}
        </div>

      </div>
    );
  }
});
module.exports = AdScreen;
