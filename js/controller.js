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
      this.renderSkin(STATE.START, contentTree);
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
    renderSkin: function(newState, args) {
      this.state = newState;
      switch (this.state) {
        case STATE.START:
          this.skin.switchComponent(STATE.START, args);
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
          break;
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
