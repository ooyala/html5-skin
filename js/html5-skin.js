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
    this.state = STATE.START;
    // Leave this here, might be useful..
    // this.transitionRules = {};
    // this.transitionRules[STATE.START] = [STATE.START, STATE.PLAYING, STATE.ERROR];
    // this.transitionRules[STATE.PLAYING] = [STATE.PAUSE, STATE.END, STATE.ERROR];
    // this.transitionRules[STATE.PAUSE] = [STATE.PLAYING, STATE.ERROR];
    // this.transitionRules[STATE.END] = [STATE.PLAYING, STATE.ERROR];
    // this.transitionRules[STATE.ERROR] = [STATE.ERROR];

    this.init();
  };

  Html5Skin.prototype = {
    init: function () {
      this.mb.subscribe(OO.EVENTS.PLAYER_CREATED, 'customerUi', _.bind(this.onPlayerCreated, this));
      this.mb.subscribe(OO.EVENTS.CONTENT_TREE_FETCHED, 'customerUi', _.bind(this.onContentTreeFetched, this));
      this.mb.subscribe(OO.EVENTS.PLAYING, 'customerUi', _.bind(this.onPlaying, this));
      this.mb.subscribe(OO.EVENTS.PAUSED, 'customerUi', _.bind(this.onPaused, this));
    },

    /*--------------------------------------------------------------------
      event listeners from core player -> regulate skin STATE
    ---------------------------------------------------------------------*/
    onPlayerCreated: function (event, elementId, params) {
      $(".innerWrapper").append("<div id='skin' style='width:100%; height:100%'></div>");

      // Would be a good idea to also (or only) wait for skin metadata to load. Load metadata here
      $.getJSON("data/data_model.json", _.bind(function(data) {
        this.skin = React.render(
          React.createElement(Skin, {data: data, controller: this}), document.getElementById("skin")
        );
      }, this));
    },

    onContentTreeFetched: function (event, contentTree) {
      this.state = STATE.START;
      this.renderSkin();
    },

    onPlaying: function() {
      this.state = STATE.PLAYING;
      this.renderSkin();
    },

    onPaused: function() {
      this.state = STATE.PAUSE;
      this.renderSkin();
    },

    /*--------------------------------------------------------------------
      Skin state -> control skin
    ---------------------------------------------------------------------*/
    renderSkin: function() {
      switch (this.state) {
        case STATE.START:
          break;
        case STATE.PLAYING:
          this.skin.setState({playing: true});
          break;
        case STATE.PAUSE:
          this.skin.setState({playing: false});
          break;
      }
    },

    /*--------------------------------------------------------------------
      skin UI-action -> publish event to core player
    ---------------------------------------------------------------------*/
    play: function() {
      switch (this.state) {
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
      if (this.state == STATE.PLAYING) {
        this.mb.publish(OO.EVENTS.PAUSE);
      }
    }
  };

  return Html5Skin;
});

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