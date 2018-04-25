var MACROS = require('./macros');
/** ******************************************************************
 CONSTANT
 *********************************************************************/
module.exports = {
  STATE: {
    START : 'start',
    PLAYING : 'playing',
    PAUSE : 'pause',
    END : 'end',
    ERROR : 'error'
  },

  SCREEN: {
    INITIAL_SCREEN: 'initialScreen',
    START_SCREEN: 'startScreen',
    PLAYING_SCREEN: 'playingScreen',
    PAUSE_SCREEN: 'pauseScreen',
    END_SCREEN: 'endScreen',
    SHARE_SCREEN: 'shareScreen',
    DISCOVERY_SCREEN: 'discoveryScreen',
    UP_NEXT_SCREEN: 'upNextScreen',
    AD_SCREEN: 'adScreen',
    MORE_OPTIONS_SCREEN: 'moreOptionsScreen',
    LOADING_SCREEN: 'loadingScreen',
    START_LOADING_SCREEN: 'startLoadingScreen',
    CLOSED_CAPTION_SCREEN: 'closedCaptionScreen',
    VIDEO_QUALITY_SCREEN: 'videoQualityScreen',
    ERROR_SCREEN: 'errorScreen',
    MULTI_AUDIO_SCREEN: 'multiAudioScreen'
  },

  MENU_OPTIONS: {
    VIDEO_QUALITY: 'videoQualityOptions',
    CLOSED_CAPTIONS: 'closedCaptionOptions',
    MULTI_AUDIO: 'multiAudioOptions'
  },

  SKIN_TEXT: {
    LEARN_MORE: 'Learn More',
    CLOSED_CAPTION_PREVIEW: 'CLOSED CAPTION PREVIEW',
    SAMPLE_TEXT: 'Sample Text',
    AD: 'Ad',
    SKIP_AD: 'Skip Ad',
    LIVE: 'LIVE',
    GO_LIVE: 'GO LIVE',
    CC_OPTIONS: 'CC Options',
    MULTI_AUDIO_OPTIONS: 'Multi Audio Options',
    ON: 'On',
    OFF: 'Off',
    DISCOVER: 'Discover',
    UP_NEXT: 'Up next',
    START_AT: 'Start at',
    EMBED: 'Embed',
    EMAIL: 'Email',
    EMAIL_BODY: 'Check out this video',
    TO: 'To',
    SUBJECT: 'Subject',
    MESSAGE: 'Message',
    RECIPIENT: 'name@email.com',
    OPTIONAL_MESSAGE: 'Optional Message',
    SEND: 'Send',
    ERROR_ACTION: 'RELOAD YOUR SCREEN OR TRY SELECTING A DIFFERENT VIDEO',
    UNKNOWN_ERROR: 'Something happened while we were trying to play your video! ' +
    'Click replay or simply reload your page.',
    LANGUAGE_TAB_TITLE: 'Language',
    COLOR_SELECTION_TAB_TITLE: 'Color Selection',
    CAPTION_OPACITY_TAB_TITLE: 'Caption Opacity',
    FONT_TYPE_TAB_TITLE: 'Font Type',
    FONT_SIZE_TAB_TITLE: 'Font Size',
    TEXT_ENHANCEMENTS_TAB_TITLE: 'Text Enhancements',
    TEXT_COLOR: 'Text color',
    BACKGROUND_COLOR: 'Background color',
    WINDOW_COLOR: 'Window color',
    TRANSPARENT: 'Transparent',
    WHITE: 'White',
    BLUE: 'Blue',
    MAGENTA: 'Magenta',
    GREEN: 'Green',
    YELLOW: 'Yellow',
    RED: 'Red',
    CYAN: 'Cyan',
    BLACK: 'Black',
    TEXT_OPACITY: 'Text opacity',
    BACKGROUND_OPACITY: 'Background opacity',
    WINDOW_OPACITY: 'Window opacity',
    FONT_SIZE: 'Font size',
    SMALL: 'Small',
    MEDIUM: 'Medium',
    LARGE: 'Large',
    EXTRA_LARGE: 'Extra Large',
    TEXT_ENHANCEMENT: 'Text enhancement',
    UNIFORM: 'Uniform',
    DEPRESSED: 'Depressed',
    RAISED: 'Raised',
    SHADOW: 'Shadow',
    PLAY: 'Play',
    REPLAY: 'Replay',
    PAUSE: 'Pause',
    MUTE: 'Mute',
    UNMUTE: 'Unmute',
    CLOSED_CAPTIONS: 'Closed Captions',
    MULTI_AUDIO: 'Multi Audio',
    FULL_SCREEN: 'Full Screen',
    EXIT_FULL_SCREEN: 'Exit Full Screen',
    VIDEO_QUALITY: 'Video Quality',
    AUTO_QUALITY: 'Auto',
    SHARE: 'Share',
    MORE_OPTIONS: 'More Options',
    SELECT_TO_UNMUTE: 'SELECT TO UNMUTE',
    AUDIO: 'Audio',
    SUBTITLES: 'Subtitles',
    UNDEFINED_LANGUAGE: 'Undefined language',
    NO_LINGUISTIC_CONTENT: 'No linguistic content'
  },

  ARIA_LABELS: {
    VIDEO_PLAYER: 'Video Player',
    START_PLAYBACK: 'Start Playback',
    PLAY: 'Play',
    PAUSE: 'Pause',
    REPLAY: 'Replay',
    MUTE: 'Mute',
    UNMUTE: 'Unmute',
    CLOSED_CAPTIONS: 'Closed Captions',
    VIDEO_QUALITY: 'Video Quality',
    AUTO_QUALITY: 'Auto',
    MULTI_AUDIO: 'Multi Audio',
    FULLSCREEN: 'Fullscreen',
    EXIT_FULLSCREEN: 'Exit Fullscreen',
    SEEK_SLIDER: 'Seek slider',
    VOLUME_SLIDER: 'Volume',
    VOLUME_PERCENT: MACROS.VOLUME + '% volume',
    TIME_DISPLAY: MACROS.CURRENT_TIME + ' of ' + MACROS.TOTAL_TIME,
    TIME_DISPLAY_LIVE: 'Live video',
    TIME_DISPLAY_DVR: MACROS.CURRENT_TIME + ' of ' + MACROS.TOTAL_TIME + ' live video',
    CLOSE: 'Close',
    TOGGLE_CLOSED_CAPTIONS: 'Toggle Closed Captions',
    CAPTION_OPTIONS: 'Closed Caption Options',
    STEREO_ON: 'Stereoscopic',
    STEREO_OFF: 'Monoscopic',
    MORE_OPTIONS: 'More Options',
    PREVIOUS_OPTIONS: 'Previous Options',
    SLIDER_VALUE_TEXT: MACROS.PERCENT + '% ' + MACROS.SETTING,
    LANGUAGE_MENU: 'Language',
    CAPTION_OPACITY_MENU: 'Caption Opacity',
    TEXT_COLOR_MENU: 'Text Color',
    BACKGROUND_COLOR_MENU: 'Background Color',
    WINDOW_COLOR_MENU: 'Window Color',
    FONT_TYPE_MENU: 'Font Type',
    FONT_SIZE_MENU: 'Font Size',
    TEXT_ENHANCEMENTS_MENU: 'Text Enhancements',
    TOGGLE_MULTI_AUDIO: 'Toggle Multi Audio',
    MULTI_AUDIO_OPTIONS: 'Closed Multi Audio Options'
  },

  ARIA_ROLES: {
    PRESENTATION: 'presentation',
    SLIDER: 'slider',
    MENU: 'menu',
    MENU_ITEM: 'menuitem',
    MENU_ITEM_RADIO: 'menuitemradio',
    MENU_ITEM_CHECKBOX: 'menuitemcheckbox',
    CHECKBOX: 'checkbox',
    TAB_LIST: 'tablist',
    TAB: 'tab',
    TAB_PANEL: 'tabpanel'
  },

  KEYBD_FOCUS_ID_ATTR: 'data-focus-id',

  FOCUS_IDS: {
    PLAY_PAUSE: 'playPause',
    MUTE_UNMUTE: 'muteUnmute',
    STEREO: 'stereo',
    VIDEO_QUALITY: 'videoQuality',
    CLOSED_CAPTIONS: 'closedCaptions',
    FULLSCREEN: 'fullscreen',
    SCRUBBER_BAR: 'scrubberBar',
    VOLUME_CONTROLS: 'volumeControls',
    VOLUME_SLIDER: 'volumeSlider',
    QUALITY_LEVEL: 'qualityLevel',
    AUTO_QUALITY: 'autoQuality',
    CLOSE: 'close',
    MULTI_AUDIO: 'multiAudio'
  },

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
    LEFT: 'left',
    RIGHT: 'right',
    UP: 'up',
    DOWN: 'down'
  },

  // KeyboardEvent's which and keyCode properties are deprecated.
  // It's a good idea to use KeyboardEvent.key moving forward even though React
  // synthetic events normalize event data.
  KEY_VALUES: {
    ENTER: 'Enter',
    TAB: 'Tab',
    CONTROL: 'Control',
    ALT: 'Alt',
    ESCAPE: 'Escape',
    SPACE: ' ', // yep
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    HOME: 'Home',
    END: 'End'
  },

  UI: {
    defaultScrubberBarHeight: 4,
    DEFAULT_SCRUBBERBAR_LEFT_RIGHT_PADDING: 15,
    MAX_BUFFERING_SPINNER_DELAY: 60000 // Max allowed value of bufferingSpinnerDelay in milliseconds
  },

  WATERMARK: {
    DEFAULT_SCALING_PERCENTAGE: 10
  },

  AD_CLICK_SOURCE: {
    VIDEO_WINDOW: 'videoWindow',
    LEARN_MORE_BUTTON: 'learnMoreButton',
    OVERLAY: 'overlay'
  },

  PAUSE_REASON: {
    TRANSITION: 'transition'
  },

  MEDIA_TYPE: {
    HTML5: 'html5',
    FLASH: 'flash',
    VIDEO: 'video',
    OBJECT: 'object'
  },

  LANGUAGE: {
    ENGLISH: 'en',
    SPANISH: 'es',
    CHINESE: 'zh',
    JAPANESE: 'ja',
    NOT_MATCHED: 'und'
  },

  ERROR_CODE: {
    NETWORK: 'network',
    SAS: 'sas',
    GEO: 'geo',
    DOMAIN: 'domain',
    FUTURE: 'future',
    PAST: 'past',
    DEVICE: 'device',
    PROXY: 'proxy',
    CONCURRENT_STREAMS: 'concurrent_streams',
    DEVICE_BINDING_FAILED: 'device_binding_failed',
    DEVICE_ID_TOO_LONG: 'device_id_too_long',
    DEVICE_INVALID_AUTH_TOKEN: 'device_invalid_auth_token',
    DEVICE_LIMIT_REACHED: 'device_limit_reached',
    NON_REGISTERED_DEVICE: 'non_registered_device',
    DRM_GENERAL_FAILURE: 'drm_general_failure',
    DRM_SERVER_ERROR: 'drm_server_error',
    INVALID_ENTITLEMENTS: 'invalid_entitlements',
    INVALID_HEARTBEAT: 'invalid_heartbeat',
    CONTENT_TREE: 'content_tree',
    METADATA: 'metadata',
    PLAYBACK: 'playback',
    STREAM: 'stream',
    LIVESTREAM: 'livestream',
    NETWORK_ERROR: 'network_error',
    UNPLAYABLE_CONTENT: 'unplayable_content',
    INVALID_EXTERNAL_ID: 'invalid_external_id',
    EMPTY_CHANNEL: 'empty_channel',
    EMPTY_CHANNEL_SET: 'empty_channel_set',
    CHANNEL_CONTENT: 'channel_content',
    UNSUPPORTED_ENCODING: 'unsupported_encoding',
    UNABLE_TO_CREATE_VIDEO_ELEMENT: 'unable_to_create_video_element'
  },

  CLOSED_CAPTIONS: {
    NO_LANGUAGE: 'none'
  },

  QUALITY_SELECTION: {
    FORMAT: {
      RESOLUTION: 'resolution',
      BITRATE: 'bitrate'
    },
    TEXT: {
      RESOLUTION_BITRATE: MACROS.RESOLUTION + 'p (' + MACROS.BITRATE + ')',
      RESOLUTION_ONLY: MACROS.RESOLUTION + 'p',
      TIERED_RESOLUTION_ONLY: MACROS.RESOLUTION + 'p (' + MACROS.RESOLUTION_TIER + ')',
      BITRATE_ONLY: MACROS.BITRATE
    }
  },

  RESOLUTION_TIER: {
    TWO: [
      'Low',
      'High'
    ],
    THREE: [
      'Low',
      'Medium',
      'High'
    ]
  },

  ERROR_MESSAGE: {
    'network':{
      name: 'OO.ERROR.API.NETWORK',
      title: 'NETWORK ERROR',
      description: 'Cannot Contact Server'
    },
    'sas':{
      name: 'OO.ERROR.API.SAS.GENERIC',
      title: 'SAS ERROR',
      description: 'Invalid Authorization Response'
    },
    'geo':{
      name: 'OO.ERROR.API.SAS.GEO',
      title: 'SAS GEO ERROR',
      description: 'This video is not authorized in your location'
    },
    'domain':{
      name: 'OO.ERROR.API.SAS.DOMAIN',
      title: 'SAS DOMAIN ERROR',
      description: 'This video is not authorized for your domain'
    },
    'future':{
      name: 'OO.ERROR.API.SAS.FUTURE',
      title: 'VIDEO COMING SOON!',
      description: 'This video is not available yet',
      action: 'You may need to refresh the page to access the video after it becomes available'
    },
    'past':{
      name: 'OO.ERROR.API.SAS.PAST',
      title: 'VIDEO NO LONGER AVAILABLE',
      description: 'This video is no longer available'
    },
    'device':{
      name: 'OO.ERROR.API.SAS.DEVICE',
      title: 'SAS DEVICE ERROR',
      description: 'This video is not authorized for playback on this device'
    },
    'proxy':{
      name: 'OO.ERROR.API.SAS.PROXY',
      title: 'SAS PROXY ERROR',
      description: 'An anonymous proxy was detected. Please disable the proxy and retry.'
    },
    'concurrent_streams':{
      name: 'OO.ERROR.API.SAS.CONCURRENT_STREAMS',
      title: 'CONCURRENT STREAMS NUMBER EXCEEDED',
      description: 'You have exceeded the maximum number of concurrent streams'
    },
    'device_binding_failed':{
      name: 'OO.ERROR.API.SAS.ERROR.DEVICE_BINDING_FAILED',
      title: 'DEVICE BINDING ERROR',
      description: 'Device binding failed'
    },
    'device_id_too_long':{
      name: 'OO.ERROR.API.SAS.ERROR.DEVICE_ID_TOO_LONG',
      title: 'DEVICE ID TOO LONG',
      description: 'Device ID is too long'
    },
    'device_invalid_auth_token':{
      name: 'OO.ERROR.API.SAS.ERROR.DEVICE_INVALID_AUTH_TOKEN',
      title: 'INVALID PLAYER TOKEN',
      description: 'Invalid Ooyala Player token'
    },
    'device_limit_reached':{
      name: 'OO.ERROR.API.SAS.ERROR.ERROR_DEVICE_LIMIT_REACHED',
      title: 'AUTHORIZATION ERROR',
      description: 'Unable to access this content, as the maximum number of devices' + 
      ' has already been authorized. Error Code 29',
      action: 'Please remove one of your authorized devices to enable this device.'
    },
    'non_registered_device':{
      name: 'OO.ERROR.API.SAS.ERROR.ERROR_NON_REGISTERED_DEVICE',
      title: 'AUTHORIZATION ERROR',
      description: 'Unable to register this device to this account, as the maximum' + 
      ' number of authorized devices has already been reached. Error Code 22',
      action: 'Please remove one of your authorized devices to enable this device.'
    },
    'drm_general_failure':{
      name: 'OO.ERROR.API.SAS.ERROR_DRM_GENERAL_FAILURE',
      title: 'LICENSE ERROR',
      description: 'General error acquiring license'
    },
    'drm_server_error':{
      name: 'OO.ERROR.API.SAS.ERROR_DRM_RIGHTS_SERVER_ERROR',
      title: 'DRM SERVER ERROR',
      description: 'DRM server error'
    },
    'invalid_entitlements':{
      name: 'OO.ERROR.API.SAS.ERROR_INVALID_ENTITLEMENTS',
      title: 'INVALID ENTITLEMENTS ERROR',
      description: 'User Entitlement Terminated - Stream No Longer Active for the User'
    },
    'invalid_heartbeat':{
      name: 'OO.ERROR.API.SAS.INVALID_HEARTBEAT',
      title: 'INVALID HEARTBEAT',
      description: 'Invalid heartbeat response'
    },
    'content_tree':{
      name: 'OO.ERROR.API.CONTENT_TREE',
      title: 'INVALID CONTENT',
      description: 'Invalid Content'
    },
    'metadata':{
      name: 'OO.ERROR.API.METADATA',
      title: 'INVALID METADATA',
      description: 'Invalid Metadata'
    },
    'playback':{
      name: 'OO.ERROR.PLAYBACK.GENERIC',
      title: 'PLAYBACK ERROR',
      description: 'Could not play the content'
    },
    'stream':{
      name: 'OO.ERROR.PLAYBACK.STREAM',
      title: 'PLAYBACK STREAM ERROR',
      description: 'This video isn\'t encoded for your device'
    },
    'livestream':{
      name: 'OO.ERROR.PLAYBACK.LIVESTREAM',
      title: 'PLAYBACK LIVESTREAM ERROR',
      description: 'Live stream is off air'
    },
    'network_error':{
      name: 'OO.ERROR.PLAYBACK.NETWORK',
      title: 'PLAYBACK NETWORK ERROR',
      description: 'Network connection temporarily lost'
    },
    'unplayable_content':{
      name: 'OO.ERROR.UNPLAYABLE_CONTENT',
      title: 'UNPLAYABLE CONTENT ERROR',
      description: 'This video is not playable on this player'
    },
    'invalid_external_id':{
      name: 'OO.ERROR.INVALID.EXTERNAL_ID',
      title: 'INVALID EXTERNAL ID',
      description: 'Invalid External ID'
    },
    'empty_channel':{
      name: 'OO.ERROR.EMPTY_CHANNEL',
      title: 'EMPTY CHANNEL ERROR',
      description: 'This channel is empty'
    },
    'empty_channel_set':{
      name: 'OO.ERROR.EMPTY_CHANNEL_SET',
      title: 'EMPTY CHANNEL SET ERROR',
      description: 'This channel set is empty'
    },
    'channel_content':{
      name: 'OO.ERROR.CHANNEL_CONTENT',
      title: 'CHANNEL CONTENT ERROR',
      description: 'This channel is not playable at this time'
    },
    'unsupported_encoding':{
      name: 'OO.ERROR.VC.UNSUPPORTED_ENCODING',
      description: 'This video isn\'t encoded for your device'
    },
    'unable_to_create_video_element':{
      name: 'OO.ERROR.VC.UNABLE_TO_CREATE_VIDEO_ELEMENT',
      description: 'Something happened while we were trying to play your video! ' +
      'Click replay or simply reload your page.'
    }
  },
  THUMBNAIL: {
    MAX_VR_THUMBNAIL_BG_WIDTH: 380,
    MAX_VR_THUMBNAIL_CAROUSEL_BG_WIDTH: 320,
    THUMBNAIL_VR_RATIO: 4,
    THUMBNAIL_CAROUSEL_VR_RATIO: 3
  },
  CLASS_NAMES: {
    SELECTABLE_SCREEN: 'oo-state-screen-selectable'
  }
};
