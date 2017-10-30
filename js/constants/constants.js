var MACROS = require('./macros');
/********************************************************************
 CONSTANT
 *********************************************************************/
module.exports = {
  STATE: {
    START : "start",
    PLAYING : "playing",
    PAUSE : "pause",
    END : "end",
    ERROR : "error"
  },

  SCREEN: {
    INITIAL_SCREEN: "initialScreen",
    START_SCREEN: "startScreen",
    PLAYING_SCREEN: "playingScreen",
    PAUSE_SCREEN: "pauseScreen",
    END_SCREEN: "endScreen",
    SHARE_SCREEN: "shareScreen",
    DISCOVERY_SCREEN: "discoveryScreen",
    UP_NEXT_SCREEN: "upNextScreen",
    AD_SCREEN: "adScreen",
    MORE_OPTIONS_SCREEN: "moreOptionsScreen",
    LOADING_SCREEN: "loadingScreen",
    CLOSEDCAPTION_SCREEN: "closedCaptionScreen",
    VIDEO_QUALITY_SCREEN: "videoQualityScreen",
    ERROR_SCREEN: "errorScreen"
  },

  SKIN_TEXT: {
    LEARN_MORE: "Learn More",
    CLOSED_CAPTION_PREVIEW: "CLOSED CAPTION PREVIEW",
    SAMPLE_TEXT: "Sample Text",
    AD: "Ad",
    SKIP_AD: "Skip Ad",
    LIVE: "LIVE",
    GO_LIVE: "GO LIVE",
    CC_OPTIONS: "CC Options",
    ON: "On",
    OFF: "Off",
    DISCOVER: "Discover",
    UP_NEXT: "Up next",
    SHARE_CALL_TO_ACTION: "Invest In Social Change",
    START_AT: "Start at",
    EMBED: "Embed",
    EMAIL: "Email",
    EMAIL_BODY: "Check out this video",
    TO: "To",
    SUBJECT: "Subject",
    MESSAGE: "Message",
    RECIPIENT: "name@email.com",
    OPTIONAL_MESSAGE: "Optional Message",
    SEND: "Send",
    ERROR_ACTION: "RELOAD YOUR SCREEN OR TRY SELECTING A DIFFERENT VIDEO",
    UNKNOWN_ERROR: "Something happened while we were trying to play your video! Click replay or simply reload your page.",
    LANGUAGE_TAB_TITLE: "Language",
    COLOR_SELECTION_TAB_TITLE: "Color Selection",
    CAPTION_OPACITY_TAB_TITLE: "Caption Opacity",
    FONT_TYPE_TAB_TITLE: "Font Type",
    FONT_SIZE_TAB_TITLE: "Font Size",
    TEXT_ENHANCEMENTS_TAB_TITLE: "Text Enhancements",
    TEXT_COLOR: "Text color",
    BACKGROUND_COLOR: "Background color",
    WINDOW_COLOR: "Window color",
    TRANSPARENT: "Transparent",
    WHITE: "White",
    BLUE: "Blue",
    MAGENTA: "Magenta",
    GREEN: "Green",
    YELLOW: "Yellow",
    RED: "Red",
    CYAN: "Cyan",
    BLACK: "Black",
    TEXT_OPACITY: "Text opacity",
    BACKGROUND_OPACITY: "Background opacity",
    WINDOW_OPACITY: "Window opacity",
    FONT_SIZE: "Font size",
    SMALL: "Small",
    MEDIUM: "Medium",
    LARGE: "Large",
    EXTRA_LARGE: "Extra Large",
    TEXT_ENHANCEMENT: "Text enhancement",
    UNIFORM: "Uniform",
    DEPRESSED: "Depressed",
    RAISED: "Raised",
    SHADOW: "Shadow",
    PLAY: "Play",
    REPLAY: "Replay",
    PAUSE: "Pause",
    MUTE: "Mute",
    UNMUTE: "Unmute",
    CLOSED_CAPTIONS: "Closed Captions",
    FULL_SCREEN: "Full Screen",
    EXIT_FULL_SCREEN: "Exit Full Screen",
    VIDEO_QUALITY: "Video Quality",
    AUTO_QUALITY: "Auto",
    SHARE: "Share",
    MORE_OPTIONS: "More Options"
  },

  ARIA_LABELS: {
    VIDEO_PLAYER: "Video Player",
    START_PLAYBACK: "Start Playback",
    PLAY: "Play",
    PAUSE: "Pause",
    REPLAY: "Replay",
    MUTE: "Mute",
    UNMUTE: "Unmute",
    VIDEO_QUALITY: "Video Quality",
    AUTO_QUALITY: "Auto",
    FULLSCREEN: "Fullscreen",
    EXIT_FULLSCREEN: "Exit Fullscreen",
    SEEK_SLIDER: "Seek slider",
    VOLUME_SLIDER: "Volume slider",
    VOLUME_PERCENT: MACROS.VOLUME + "% volume",
    TIME_DISPLAY: MACROS.CURRENT_TIME + " of " + MACROS.TOTAL_TIME,
    TIME_DISPLAY_LIVE: "Live video",
    TIME_DISPLAY_DVR: MACROS.CURRENT_TIME + " of " + MACROS.TOTAL_TIME + " live video",
    QUALITY_LEVEL: "Quality level " + MACROS.LEVEL + ", " + MACROS.QUALITY,
    CLOSE: "Close",
    STEREO_ON: "Stereoscopic",
    STEREO_OFF: "Monoscopic"
  },

  ARIA_ROLES: {
    SLIDER: "slider",
    MENU: "menu",
    MENU_ITEM: "menuitem",
    MENU_ITEM_RADIO: "menuitemradio"
  },

  KEYBD_FOCUS_ID_ATTR: "data-focus-id",

  A11Y_CTRLS: {
    SEEK_DELTA: 5,
    VOLUME_CHANGE_DELTA: 10
  },

  KEYCODES: {
    SPACE_KEY: 32,
    LEFT_ARROW_KEY: 37,
    RIGHT_ARROW_KEY: 39,
    UP_ARROW_KEY: 38,
    DOWN_ARROW_KEY: 40,
    ESCAPE_KEY: 27,
    A: 65,
    D: 68,
    W: 87,
    S: 83
  },

  DIRECTIONS: {
    LEFT: "left",
    RIGHT: "right",
    UP: "up",
    DOWN: "down"
  },

  // KeyboardEvent's which and keyCode properties are deprecated.
  // It's a good idea to use KeyboardEvent.key moving forward even though React
  // synthetic events normalize event data.
  KEY_VALUES: {
    ENTER: "Enter",
    TAB: "Tab",
    CONTROL: "Control",
    ALT: "Alt",
    ESCAPE: "Escape",
    SPACE: " ", // yep
    ARROW_UP: "ArrowUp",
    ARROW_DOWN: "ArrowDown",
    ARROW_LEFT: "ArrowLeft",
    ARROW_RIGHT: "ArrowRight",
    HOME: "Home",
    END: "End"
  },

  UI: {
    defaultScrubberBarHeight: 4,
    DEFAULT_SCRUBBERBAR_LEFT_RIGHT_PADDING: 15,
    MAX_BUFFERING_SPINNER_DELAY: 60000 // Max allowed value of bufferingSpinnerDelay in milliseconds
  },

  WATERMARK: {
    DEFAULT_SCALING_PERCENTAGE: 10
  },

  AD_CLICK_SOURCE:{
    VIDEO_WINDOW: "videoWindow",
    LEARN_MORE_BUTTON: "learnMoreButton",
    OVERLAY: "overlay"
  },

  PAUSE_REASON: {
    TRANSITION: "transition"
  },

  MEDIA_TYPE: {
    HTML5: "html5",
    FLASH: "flash",
    VIDEO: "video",
    OBJECT: "object"
  },

  CLOSED_CAPTIONS: {
    NO_LANGUAGE: 'none'
  },

  ERROR_MESSAGE: {
    "network":{
      name: "OO.ERROR.API.NETWORK",
      title: "NETWORK ERROR",
      description: "Cannot Contact Server"
    },
    "sas":{
      name: "OO.ERROR.API.SAS.GENERIC",
      title: "SAS ERROR",
      description: "Invalid Authorization Response"
    },
    "geo":{
      name: "OO.ERROR.API.SAS.GEO",
      title: "SAS GEO ERROR",
      description: "This video is not authorized in your location"
    },
    "domain":{
      name: "OO.ERROR.API.SAS.DOMAIN",
      title: "SAS DOMAIN ERROR",
      description: "This video is not authorized for your domain"
    },
    "future":{
      name: "OO.ERROR.API.SAS.FUTURE",
      title: "VIDEO NOT AVAILABLE YET",
      description: "This video will be available soon"
    },
    "past":{
      name: "OO.ERROR.API.SAS.PAST",
      title: "VIDEO NO LONGER AVAILABLE",
      description: "This video is no longer available"
    },
    "device":{
      name: "OO.ERROR.API.SAS.DEVICE",
      title: "SAS DEVICE ERROR",
      description: "This video is not authorized for playback on this device"
    },
    "proxy":{
      name: "OO.ERROR.API.SAS.PROXY",
      title: "SAS PROXY ERROR",
      description: "An anonymous proxy was detected. Please disable the proxy and retry."
    },
    "concurrent_streams":{
      name: "OO.ERROR.API.SAS.CONCURRENT_STREAMS",
      title: "CONCURRENT STREAMS NUMBER EXCEEDED",
      description: "You have exceeded the maximum number of concurrent streams"
    },
    "device_binding_failed":{
      name: "OO.ERROR.API.SAS.ERROR.DEVICE_BINDING_FAILED",
      title: "DEVICE BINDING ERROR",
      description: "Device binding failed"
    },
    "device_id_too_long":{
      name: "OO.ERROR.API.SAS.ERROR.DEVICE_ID_TOO_LONG",
      title: "DEVICE ID TOO LONG",
      description: "Device ID is too long"
    },
    "device_invalid_auth_token":{
      name: "OO.ERROR.API.SAS.ERROR.DEVICE_INVALID_AUTH_TOKEN",
      title: "INVALID PLAYER TOKEN",
      description: "Invalid Ooyala Player token"
    },
    "device_limit_reached":{
      name: "OO.ERROR.API.SAS.ERROR.DEVICE_LIMIT_REACHED",
      title: "DEVICE LIMIT REACHED",
      description: "Device limit has been reached"
    },
    "drm_general_failure":{
      name: "OO.ERROR.API.SAS.ERROR_DRM_GENERAL_FAILURE",
      title: "LICENSE ERROR",
      description: "General error acquiring license"
    },
    "drm_server_error":{
      name: "OO.ERROR.API.SAS.ERROR_DRM_RIGHTS_SERVER_ERROR",
      title: "DRM SERVER ERROR",
      description: "DRM server error"
    },
    "invalid_entitlements":{
      name: "OO.ERROR.API.SAS.ERROR_INVALID_ENTITLEMENTS",
      title: "INVALID ENTITLEMENTS ERROR",
      description: "User Entitlement Terminated - Stream No Longer Active for the User"
    },
    "invalid_heartbeat":{
      name: "OO.ERROR.API.SAS.INVALID_HEARTBEAT",
      title: "INVALID HEARTBEAT",
      description: "Invalid heartbeat response"
    },
    "content_tree":{
      name: "OO.ERROR.API.CONTENT_TREE",
      title: "INVALID CONTENT",
      description: "Invalid Content"
    },
    "metadata":{
      name: "OO.ERROR.API.METADATA",
      title: "INVALID METADATA",
      description: "Invalid Metadata"
    },
    "playback":{
      name: "OO.ERROR.PLAYBACK.GENERIC",
      title: "PLAYBACK ERROR",
      description: "Could not play the content"
    },
    "stream":{
      name: "OO.ERROR.PLAYBACK.STREAM",
      title: "PLAYBACK STREAM ERROR",
      description: "This video isn't encoded for your device"
    },
    "livestream":{
      name: "OO.ERROR.PLAYBACK.LIVESTREAM",
      title: "PLAYBACK LIVESTREAM ERROR",
      description: "Live stream is off air"
    },
    "network_error":{
      name: "OO.ERROR.PLAYBACK.NETWORK",
      title: "PLAYBACK NETWORK ERROR",
      description: "Network connection temporarily lost"
    },
    "unplayable_content":{
      name: "OO.ERROR.UNPLAYABLE_CONTENT",
      title: "UNPLAYABLE CONTENT ERROR",
      description: "This video is not playable on this player"
    },
    "invalid_external_id":{
      name: "OO.ERROR.INVALID.EXTERNAL_ID",
      title: "INVALID EXTERNAL ID",
      description: "Invalid External ID"
    },
    "empty_channel":{
      name: "OO.ERROR.EMPTY_CHANNEL",
      title: "EMPTY CHANNEL ERROR",
      description: "This channel is empty"
    },
    "empty_channel_set":{
      name: "OO.ERROR.EMPTY_CHANNEL_SET",
      title: "EMPTY CHANNEL SET ERROR",
      description: "This channel set is empty"
    },
    "channel_content":{
      name: "OO.ERROR.CHANNEL_CONTENT",
      title: "CHANNEL CONTENT ERROR",
      description: "This channel is not playable at this time"
    },
    "unsupported_encoding":{
      name: "OO.ERROR.VC.UNSUPPORTED_ENCODING",
      description: "This video isn't encoded for your device"
    },
    "unable_to_create_video_element":{
      name: "OO.ERROR.VC.UNABLE_TO_CREATE_VIDEO_ELEMENT",
      description: "Something happened while we were trying to play your video! Click replay or simply reload your page."
    }
  }
};
