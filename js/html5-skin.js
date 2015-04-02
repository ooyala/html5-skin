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
      this.renderSkin(STATE.START);
    },

    onPlaying: function() {
      this.renderSkin(STATE.PLAYING);
    },

    onPaused: function() {
      this.renderSkin(STATE.PAUSE);
    },

    /*--------------------------------------------------------------------
      Skin state -> control skin
    ---------------------------------------------------------------------*/
    renderSkin: function(newState) {
      this.state = newState;
      switch (this.state) {
        case STATE.START:
          this.skin.switchComponent(STATE.START);
          break;
        case STATE.PLAYING:
          this.skin.switchComponent(STATE.PLAYING);
          break;
        case STATE.PAUSE:
          this.skin.switchComponent(STATE.PAUSE);
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
  RENDERER PLACEHOLDER
*********************************************************************/
var Skin = React.createClass({
  getInitialState: function() {
    return {screen: STATE.START};
  },

  switchComponent: function(newState) {
    this.setState({screen: newState});
  },

  render: function() {
    switch (this.state.screen) {
      case STATE.START:
        return (
          <PauseScreen data={this.props.data} controller={this.props.controller} playing={false}/>
        );
      case STATE.PLAYING:
        return (
          <PlayingScreen data={this.props.data} controller={this.props.controller} playing={true}/>
        );
      case STATE.PAUSE:
        return (
          <PauseScreen data={this.props.data} controller={this.props.controller} playing={false}/>
        );
      default:
        return "";
    }
  }
});

/********************************************************************
  START SCREEN
*********************************************************************/

var StartScreen = React.createClass({
  render: function() {
    return "";
  }
});

/********************************************************************
  PLAYING SCREEN
*********************************************************************/

var PlayingScreen = React.createClass({
  getInitialState: function() {
    return {showControls : true};
  },

  handleMouseMove: function() {
    this.setState({showControls : true});
  },

  handleMouseOut: function() {
    this.setState({showControls : false});
  },

  handleClick: function() {
    this.props.controller.pause();
  },

  render: function() {
    var style = {
      width : "100%",
      height : "100%",
      position : "absolute",
      zIndex : 20000,
      overflow: "hidden",
    };

    var skinSetting = this.props.data.skin;
    var playClass = skinSetting.pauseButton.icon;
    var playStyle = skinSetting.pauseButton.style;
    playStyle.opacity = this.state.showControls ? 1 : 0;

    return (
      <div style={style} onMouseMove={this.handleMouseMove} onMouseOut={this.handleMouseOut}>
        <span className={playClass} style={playStyle} aria-hidden="true" onClick={this.handleClick}></span>
      </div>
    );
  }
});

/********************************************************************
  PAUSE SCREEN
*********************************************************************/

var PauseScreen = React.createClass({
  getInitialState: function() {
    return {showControls : true};
  },

  handleMouseMove: function() {
    this.setState({showControls : true});
  },

  handleMouseOut: function() {
    this.setState({showControls : false});
  },

  handleClick: function() {
    this.props.controller.play();
  },

  render: function() {
    var style = {
      width : "100%",
      height : "100%",
      position : "absolute",
      zIndex : 20000,
      overflow: "hidden",
    };

    var skinSetting = this.props.data.skin;
    var playClass = skinSetting.playButton.icon;
    var playStyle = skinSetting.playButton.style;
    playStyle.opacity = this.state.showControls ? 1 : 0;

    return (
      <div style={style} onMouseMove={this.handleMouseMove} onMouseOut={this.handleMouseOut}>
        <span className={playClass} style={playStyle} aria-hidden="true" onClick={this.handleClick}></span>
      </div>
    );
  }
});

/********************************************************************
  END SCREEN
*********************************************************************/

var EndScreen = React.createClass({
  render: function() {
    return "";
  }
});

/********************************************************************
  ERROR SCREEN
*********************************************************************/

var ErrorScreen = React.createClass({
  render: function() {
    return "";
  }
});