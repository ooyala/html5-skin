OO.plugin("Html5Skin", function (OO, _, $, W) {

  Html5Skin = function (mb, id) {
    var START = "start",
        PLAYING = "playing",
        PAUSE = "pause"
        END = "end";
    this.mb = mb;
    this.id = id;
    this.playerState = this.START;

    this.init();
  };

  Html5Skin.prototype = {
    init: function () {
        this.mb.subscribe(OO.EVENTS.PLAYER_CREATED, 'customerUi', _.bind(this.onPlayerCreate, this));
    },

    // Handles the PLAYER_CREATED event
    // First parameter is the event name
    // Second parameter is the elementId of player container
    // Third parameter is the list of parameters which were passed into
    // player upon creation.
    // In this section, we use this opportunity to create the custom UI
    onPlayerCreate: function (event, elementId, params) {
      $(".innerWrapper").append("<div id='skin' style='width:100%; height:100%'></div>");

      // Would be a good idea to also (or only) wait for skin metadata to load. Load metadata here
      $.getJSON("data/data_model.json", _.bind(function(data) {
        React.render(
          React.createElement(Skin, {data: data, controller: this}), document.getElementById("skin")
        );
      }, this));
    },

    // ACTION
    play: function() {
      switch (this.playerState) {
        case this.START:
        case this.END:
          this.mb.publish(OO.EVENTS.INITIAL_PLAY);
          this.playerState = this.PLAYING;
          break;
        case this.PAUSE:
          this.mb.publish(OO.EVENTS.PLAY);
          this.playerState = this.PLAYING;
          break
      }
    },

    pause: function() {
      if (this.playerState == this.PLAYING) {
        this.mb.publish(OO.EVENTS.PAUSE);
        this.playerState = this.PAUSE;
      }
    }
  };

  return Html5Skin;
});


var Skin = React.createClass({
  getInitialState: function() {
    return { playing: false, playhead: 0, duration: 1};
  },

  componentDidMount: function() {

  },

  onPlaybackReady: function() {

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