/********************************************************************
  AD SCREEN
*********************************************************************/
var React = require('react'),
    CONSTANTS = require('../constants/constants'),
    AdPanel = require('../components/adPanel'),
    ControlBar = require('../components/controlBar'),
    ScrubberBar = require('../components/scrubberBar'),
    ClassNames = require('classnames'),
    Utils = require('../components/utils'),
    ResizeMixin = require('../mixins/resizeMixin');

var AdScreen = React.createClass({
  mixins: [ResizeMixin],

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

    //for mobile or desktop fullscreen, hide control bar after 3 seconds
    if (this.isMobile || this.props.fullscreen){
      this.props.controller.startHideControlBarTimer();
    }
  },

  componentWillUnmount: function () {
    this.props.controller.cancelTimer();
  },

  componentWillUpdate: function(nextProps) {
    if(nextProps) {
      if (nextProps.controller.state.controlBarVisible == false && this.state.controlBarVisible == true) {
        this.hideControlBar();
      }

      if (nextProps.controller.state.controlBarVisible == true && this.state.controlBarVisible == false) {
        this.showControlBar();
      }

      if(!this.props.fullscreen && nextProps.fullscreen && this.state.playerState != CONSTANTS.STATE.PAUSE) {
        this.props.controller.startHideControlBarTimer();
      }
      if(this.props.fullscreen && !nextProps.fullscreen && this.isMobile) {
        this.showControlBar();
        this.props.controller.startHideControlBarTimer();
      }
    }
  },

  handleResize: function() {
    if (this.isMounted()) {
      this.setState({controlBarWidth: this.getDOMNode().clientWidth});
      this.props.controller.startHideControlBarTimer();
    }
  },

  handleClick: function(event) {
    event.stopPropagation(); // W3C
    event.cancelBubble = true; // IE

    this.props.controller.state.accessibilityControlsEnabled = true;
    if ((event.type == 'click' || !this.isMobile) && !this.props.skinConfig.adScreen.showAdMarquee) {
      this.props.controller.onAdsClicked(CONSTANTS.AD_CLICK_SOURCE.VIDEO_WINDOW);
    }
  },

  handlePlayerClicked: function(event) {
    if (event.type == 'click' || !this.isMobile){
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
    this.props.controller.showControlBar();
  },

  hideControlBar: function() {
    if (this.props.controlBarAutoHide == true){
      this.setState({controlBarVisible: false});
      this.props.controller.hideControlBar();
    }
  },

  handleTouchEnd: function(event) {
    if (!this.state.controlBarVisible && this.props.skinConfig.adScreen.showControlBar){
      this.showControlBar();
      this.props.controller.startHideControlBarTimer();
    }
    else {
      this.handlePlayerClicked(event);
    }
  },

  handlePlayerMouseMove: function() {
    if(this.props.playerState !== CONSTANTS.STATE.PAUSE && !this.isMobile && this.props.fullscreen) {
      this.showControlBar();
      this.props.controller.startHideControlBarTimer();
    }
  },

  getPlaybackControlItems: function() {

    var showControlBar =
      this.props.playerState == CONSTANTS.STATE.PAUSE ||
      this.props.controller.state.forceControlBarVisible ||
      this.state.controlBarVisible;

    var playbackControlItemTemplates = {
     "scrubberBar": <ScrubberBar {...this.props}
       controlBarVisible={showControlBar}
       controlBarWidth={this.state.controlBarWidth} />,

     "controlBar": <ControlBar {...this.props}
       controlBarVisible={showControlBar}
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

    var adScreenClasses = ClassNames({
      "adScreen": true,
      "hidden": !this.state.controlBarVisible
    });

    return (
      <div className="state-screen adScreen"
         ref="adScreen"
         onMouseOver={this.showControlBar}
         onMouseOut={this.hideControlBar}
         onMouseMove={this.handlePlayerMouseMove}
         onMouseUp={this.handleClick}>

        <div className="adPanel" ref="adPanel" onClick={this.handlePlayerClicked} onTouchEnd={this.handleTouchEnd}>
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
