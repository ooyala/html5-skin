// TODO: Need to separate these into their own respective files, then combine with build script
/********************************************************************
  CONSTANT
*********************************************************************/
STATE = {
  START : "start",
  PLAYING : "playing",
  PAUSE : "pause",
  END : "end",
  ERROR : "error"
};

/********************************************************************
  CONTROLLER
*********************************************************************/
OO.plugin("Html5Skin", function (OO, _, $, W) {

  Html5Skin = function (mb, id) {
    this.mb = mb;
    this.id = id;

    this.init();
  };

  Html5Skin.prototype = {
    init: function () {
      this.stateMachine = new stateMachine();
      this.mb.subscribe(OO.EVENTS.PLAYER_CREATED, 'customerUi', _.bind(this.onPlayerCreated, this));
      this.mb.subscribe(OO.EVENTS.CONTENT_TREE_FETCHED, 'customerUi', _.bind(this.onContentTreeFetched, this));
      this.mb.subscribe(OO.EVENTS.PLAYING, 'customerUi', _.bind(this.onPlaying, this));
      this.mb.subscribe(OO.EVENTS.PAUSED, 'customerUi', _.bind(this.onPaused, this));
    },

    /*
      Put core player event listeners here and regulate STATE machine. State Machine will then try to control skin renderer
    */
    onPlayerCreated: function (event, elementId, params) {
      $(".innerWrapper").append("<div id='skin' style='width:100%; height:100%'></div>");

      // Would be a good idea to also (or only) wait for skin metadata to load. Load metadata here
      $.getJSON("data/data_model.json", _.bind(function(data) {
        React.render(
          React.createElement(Skin, {data: data, controller: this}), document.getElementById("skin")
        );
      }, this));
    },

    onContentTreeFetched: function (event, contentTree) {
      this.stateMachine.setState(STATE.START, contentTree);
    },

    onPlaying: function() {
      this.stateMachine.setState(STATE.PLAYING);
    },

    onPaused: function() {
      this.stateMachine.setState(STATE.PAUSE);
    },

    /*
      Action from UI event. Will publish to message bus to control core player
    */
    play: function() {
      switch (this.stateMachine.getState()) {
        case STATE.START:
        case STATE.END:
          this.mb.publish(OO.EVENTS.INITIAL_PLAY);
          break;
        case STATE.PAUSE:
          this.mb.publish(OO.EVENTS.PLAY);
          break
      }
    },

    pause: function() {
      if (this.stateMachine.getState() == STATE.PLAYING) {
        this.mb.publish(OO.EVENTS.PAUSE);
      }
    }
  };

  return Html5Skin;
});

/********************************************************************
  STATE MACHINE
*********************************************************************/
stateMachine = function() {
  this.state = STATE.START;
  this.transitionRules = {};
  this.transitionRules[STATE.START] = [STATE.START, STATE.PLAYING, STATE.ERROR];
  this.transitionRules[STATE.PLAYING] = [STATE.PAUSE, STATE.END, STATE.ERROR];
  this.transitionRules[STATE.PAUSE] = [STATE.PLAYING, STATE.ERROR];
  this.transitionRules[STATE.END] = [STATE.PLAYING, STATE.ERROR];
  this.transitionRules[STATE.ERROR] = [STATE.ERROR];
};

stateMachine.prototype = {
  checkTransitionState: function(state) {
    // return true if current state can transition to new state
    return this.transitionRules[this.getState()].indexOf(state) > -1;
  },

  getState: function() {
    return this.state;
  },

  setState: function(state, args) {
    if (this.checkTransitionState(state)) {
      this.state = state;
      this.renderSkin(args);
      return true;
    } else {
      return false;
    }
  },

  // Need to be changed later on
  renderSkin: function(args) {
    switch(this.getState()) {
      case STATE.START:
        break;
      case STATE.PLAYING:
        break;
      case STATE.PAUSE:
        break;
    }
  }
};

/********************************************************************
  RENDERER
*********************************************************************/
var Skin = React.createClass({
  getInitialState: function() {
    return { playing: false, playhead: 0, duration: 1};
  },

  componentDidMount: function() {

  },

  handleMouseMove: function() {
    this.setState({showControls : true});
  },

  handleMouseOut: function() {
    this.setState({showControls : false});
  },

  handleClick: function() {
    if (this.state.playing) {
      this.props.controller.pause();
    } else {
      this.props.controller.play();
    }
    // this need to listen from MB or directed by HTML5Skin controller
    this.setState({playing: !this.state.playing});
  },

  render: function() {
    var style = {
      width : "100%",
      height : "100%",
      position : "absolute",
      zIndex : 20000,
      overflow: "hidden",
    };

    var skinSetting = (this.props.data.skin);
    if (skinSetting) {
      // Use user configured setting from metadata
      if(this.state.playing) {
        var playClass = skinSetting.pauseButton.icon;
        var playStyle = skinSetting.pauseButton.style;
      } else {
        var playClass = skinSetting.playButton.icon;
        var playStyle = skinSetting.playButton.style;
      }
      playStyle.opacity = this.state.showControls ? 1 : 0;
    } else {
      // default setting, need to be static in alice package
      var playClass = (this.state.playing) ? "glyphicon glyphicon-pause" : "glyphicon glyphicon-play";
    }

    return (
      <div style={style} onMouseMove={this.handleMouseMove} onMouseOut={this.handleMouseOut}>
        <span className={playClass} style={playStyle} aria-hidden="true" onClick={this.handleClick}></span>
      </div>
    );
  }
});