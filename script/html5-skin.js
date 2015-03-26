OO.plugin("Html5Skin", function (OO, _, $, W) {

  Html5Skin = function (mb, id) {
    this.mb = mb;
    this.id = id;

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
      this.playerRoot = $("#" + elementId);
      console.log(this.playerRoot);
      $(".innerWrapper").append("<div id='skin' style='width:100%; height:100%'></div>");

      React.render(
        React.createElement(Skin, {}), document.getElementById("skin")
      );
    }
  };

  return Html5Skin;
});


var Skin = React.createClass({
  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {

  },

  onPlaybackReady: function() {

  },

  render: function() {
    var style = {
      width : this.props.width,
      height : this.props.height,
      position : "absolute",
      zIndex : 1,
      overflow: "hidden",
    };

    return (
      <div>
      </div>
    );
  }
});