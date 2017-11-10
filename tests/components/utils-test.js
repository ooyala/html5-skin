jest.dontMock('../../js/components/utils');
jest.dontMock('../../js/constants/constants');
jest.dontMock('deepmerge');
jest.dontMock('../../config/skin');

var Utils = require('../../js/components/utils');
var CONSTANTS = require('../../js/constants/constants');
var DeepMerge = require('deepmerge');
var SkinJSON = require('../../config/skin');
OO = {
  log: function(a) {console.info(a);}
};

describe('Utils', function () {
  it('tests the utility functions', function () {
    var text = 'This is text. Really really long text that needs to be truncated to smaller text the fits on X amount of lines.';
    var div = document.createElement('div');
    div.clientWidth = 20;
    var truncateText = Utils.truncateTextToWidth(div, text);
    expect(truncateText).toContain(text);

    var cloned = Utils.clone({player: 'v4'});
    expect(cloned.player).toEqual('v4');

    var extended = Utils.extend({player: 'v4'}, {player: 'v3'});
    expect(extended.player).toEqual('v3');

    var formatedSeconds = Utils.formatSeconds(888.031);
    expect(formatedSeconds).toEqual('14:48');
    formatedSeconds = Utils.formatSeconds(80088.031);
    expect(formatedSeconds).toEqual('22:14:48');

    var browserSupportsTouch = Utils.browserSupportsTouch();
    expect(browserSupportsTouch).toBeFalsy();
  });

  describe('autoFocusFirstElement', function() {
    var container, elem1, elem2, elem3;

    beforeEach(function() {
      container = document.createElement('div');

      elem1 = document.createElement('div');
      elem1.setAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR, '1');
      container.appendChild(elem1);

      elem2 = document.createElement('div');
      elem2.setAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR, '2');
      container.appendChild(elem2);

      elem3 = document.createElement('div');
      elem3.setAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR, '3');
      container.appendChild(elem3);
    });

    it('should focus on first focusable element', function() {
      var focusCalled = false;
      elem1.focus = function() {
        focusCalled = true;
      };
      Utils.autoFocusFirstElement(container);
      expect(focusCalled).toBe(true);
    });

    it('should focus on next focusable element if first is excluded by class', function() {
      var focus1Called = false;
      var focus2Called = false;
      elem1.setAttribute('class', 'exclude');
      elem1.focus = function() {
        focus1Called = true;
      };
      elem2.focus = function() {
        focus2Called = true;
      };
      Utils.autoFocusFirstElement(container, 'exclude');
      expect(focus1Called).toBe(false);
      expect(focus2Called).toBe(true);
    });

  });

  describe('blurOnMouseUp', function() {

    it('should call blur() on currentTarget', function() {
      var blurCalled = false;
      var event = {
        currentTarget: {
          blur: function() {
            blurCalled = true;
          }
        }
      };
      Utils.blurOnMouseUp(event);
      expect(blurCalled).toBe(true);
    });

  });

  describe('ensureNumber', function() {

    it('should return the Number equivalent of a string', function() {
      expect(Utils.ensureNumber('233')).toBe(233);
      expect(Utils.ensureNumber('10.233')).toBe(10.233);
    });

    it('should return null when the input value is not finite or a parsable Number', function() {
      expect(Utils.ensureNumber('w00t233')).toBeNull();
      expect(Utils.ensureNumber(Infinity)).toBeNull();
      expect(Utils.ensureNumber({})).toBeNull();
      expect(Utils.ensureNumber(NaN)).toBeNull();
    });

    it('should return defaultValue when provided if input value is not finite or a parsable Number', function() {
      expect(Utils.ensureNumber('w00t233', 1)).toBe(1);
      expect(Utils.ensureNumber(Infinity, 2)).toBe(2);
      expect(Utils.ensureNumber({}, 'error')).toBe('error');
      expect(Utils.ensureNumber(NaN, 3)).toBe(3);
    });

  });

  describe('constrainToRange', function() {

    it('should return the Number equivalent of value if it falls within range', function() {
      expect(Utils.constrainToRange(5, 1, 10)).toBe(5);
      expect(Utils.constrainToRange(0, -5, 5)).toBe(0);
      expect(Utils.constrainToRange('50', '1', '100')).toBe(50);
    });

    it('should return min or max when value is outside of range', function() {
      expect(Utils.constrainToRange(1, 5, 10)).toBe(5);
      expect(Utils.constrainToRange(15, 5, 10)).toBe(10);
      expect(Utils.constrainToRange(-10, 0, 100)).toBe(0);
    });

    it('should return the Number equivalent of input values', function() {
      expect(Utils.constrainToRange(1, '5', 10)).toBe(5);
      expect(Utils.constrainToRange(15, 5, '10')).toBe(10);
      expect(Utils.constrainToRange(-10, '0', 100)).toBe(0);
      expect(Utils.constrainToRange('50', '1', '100')).toBe(50);
    });

  });

  describe('getTimeDisplayValues', function() {

    it('should return formatted currentTime and totalTime for VOD', function() {
      var values = Utils.getTimeDisplayValues(60, 120, false, false);
      expect(values.currentTime).toEqual('01:00');
      expect(values.totalTime).toEqual('02:00');
      values = Utils.getTimeDisplayValues(0, 122, false, false);
      expect(values.currentTime).toEqual('00:00');
      expect(values.totalTime).toEqual('02:02');
    });

    it('should return empty currentTime and totalTime for Live videos with no DVR', function() {
      var values = Utils.getTimeDisplayValues(0, -0, true, false);
      expect(values.currentTime).toEqual('');
      expect(values.totalTime).toEqual('');
      values = Utils.getTimeDisplayValues(0, Infinity, true, false);
      expect(values.currentTime).toEqual('');
      expect(values.totalTime).toEqual('');
    });

    it('should return formatted negative currentTime and empty totalTime for Live DVR videos when useNegativeDvrOffset equals true', function() {
      var values = Utils.getTimeDisplayValues(900, 1800, true, true);
      expect(values.currentTime).toEqual('-15:00');
      expect(values.totalTime).toEqual('');
      values = Utils.getTimeDisplayValues(0, 1800, true, true);
      expect(values.currentTime).toEqual('-30:00');
      expect(values.totalTime).toEqual('');
    });

    it('should return empty currentTime for Live DVR videos when useNegativeDvrOffset equals true and playhead is at live position', function() {
      var values = Utils.getTimeDisplayValues(1800, 1800, true, true);
      expect(values.currentTime).toEqual(''); // Playhead is at live position so it's not displayed
      expect(values.totalTime).toEqual('');
    });

    it('should return formatted currentTime and totalTime for Live DVR videos when useNegativeDvrOffset equals false', function() {
      var values = Utils.getTimeDisplayValues(1800, 1800, true, false);
      expect(values.currentTime).toEqual('30:00');
      expect(values.totalTime).toEqual('30:00');
      values = Utils.getTimeDisplayValues(0, 1800, true, false);
      expect(values.currentTime).toEqual('00:00');
      expect(values.totalTime).toEqual('30:00');
      values = Utils.getTimeDisplayValues(900, 1800, true, false);
      expect(values.currentTime).toEqual('15:00');
      expect(values.totalTime).toEqual('30:00');
    });

  });

  it('tests isSafari', function () {
    navigator.__defineGetter__('userAgent', function(){ return 'AppleWebKit'; });
    var isSafari = Utils.isSafari();
    expect(isSafari).toBeTruthy();

    navigator.__defineGetter__('userAgent', function(){ return 'jsdom'; });
    isSafari = Utils.isSafari();
    expect(isSafari).toBeFalsy();
  });

  it('tests isEdge', function () {
    navigator.__defineGetter__('userAgent', function(){ return 'Edge'; });
    var isEdge = Utils.isEdge();
    expect(isEdge).toBeTruthy();
    navigator.__defineGetter__('userAgent', function(){ return 'jsdom'; });
    isEdge = Utils.isEdge();
    expect(isEdge).toBeFalsy();
  });

  it('tests isIE', function () {
    navigator.__defineGetter__('userAgent', function(){ return 'MSIE'; });
    var isIE = Utils.isIE();
    expect(isIE).toBeTruthy();
    navigator.__defineGetter__('userAgent', function(){ return 'jsdom'; });
    isIE = Utils.isIE();
    expect(isIE).toBeFalsy();
  });

  it('tests isAndroid', function () {
    navigator.__defineGetter__('appVersion', function(){ return 'Android'; });
    var isAndroid = Utils.isAndroid();
    expect(isAndroid).toBeTruthy();
    navigator.__defineGetter__('appVersion', function(){ return 'jsdom'; });
    isAndroid = Utils.isAndroid();
    expect(isAndroid).toBeFalsy();
  });

  it('tests isIos', function () {
    navigator.__defineGetter__('platform', function(){ return 'iPhone'; });
    var isIos = Utils.isIos();
    expect(isIos).toBeTruthy();
    navigator.__defineGetter__('platform', function(){ return 'jsdom'; });
    isIos = Utils.isIos();
    expect(isIos).toBeFalsy();
  });

  it('tests isIPhone', function () {
    navigator.__defineGetter__('platform', function(){ return 'iPod'; });
    var isIPhone = Utils.isIPhone();
    expect(isIPhone).toBeTruthy();
    navigator.__defineGetter__('platform', function(){ return 'jsdom'; });
    isIPhone = Utils.isIPhone();
    expect(isIPhone).toBeFalsy();
  });

  it('tests isMobile', function () {
    navigator.__defineGetter__('platform', function(){ return 'iPod'; });
    var isMobile = Utils.isMobile();
    expect(isMobile).toBeTruthy();
    navigator.__defineGetter__('platform', function(){ return 'jsdom'; });
    isMobile = Utils.isMobile();
    expect(isMobile).toBeFalsy();
  });

  it('tests isIE10', function () {
    navigator.__defineGetter__('userAgent', function(){ return 'MSIE 10'; });
    var isIE10 = Utils.isIE10();
    expect(isIE10).toBeTruthy();
    navigator.__defineGetter__('userAgent', function(){ return 'jsdom'; });
    isIE10 = Utils.isIE10();
    expect(isIE10).toBeFalsy();
  });

  it('tests getLanguageToUse', function () {
    var skinConfig = {
      localization: {
        defaultLanguage: 'zh'
      }
    };
    var skinConfig2 = {
      localization: {
        defaultLanguage: '',
        availableLanguageFile: [
          {
            "language": "en",
            "languageFile": "//player.ooyala.com/static/v4/candidate/latest/skin-plugin/en.json",
            "androidResource": "skin-config/en.json",
            "iosResource": "en"
          },
          {
            "language": "es",
            "languageFile": "//player.ooyala.com/static/v4/candidate/latest/skin-plugin/es.json",
            "androidResource": "skin-config/es.json",
            "iosResource": "es"
          },
          {
            "language": "zh",
            "languageFile": "//player.ooyala.com/static/v4/candidate/latest/skin-plugin/zh.json",
            "androidResource": "skin-config/zh.json",
            "iosResource": "zh"
          }
        ]
      }
    };
    var getLanguageToUse = Utils.getLanguageToUse(skinConfig);
    expect(getLanguageToUse).toEqual('zh');
    navigator.__defineGetter__('browserLanguage', function(){ return "es-US"; });
    getLanguageToUse = Utils.getLanguageToUse(skinConfig2);
    expect(getLanguageToUse).toEqual('en');
  });

  it('tests getLocalizedString', function () {
    var text = 'This is the share page';
    var localizedString = Utils.getLocalizedString('en', 'shareText', {en: {shareText: text}});
    expect(localizedString).toBe(text);

    localizedString = Utils.getLocalizedString(null, null, null);
    expect(localizedString).toBe("");
  });

  it('tests getPropertyValue', function () {
    var defaultVal = Utils.getPropertyValue({}, 'property.nestedProp', 'default');
    expect(defaultVal).toEqual('default');

    var undefinedVal = Utils.getPropertyValue({}, 'property.nestedProp');
    expect(undefinedVal).toBeUndefined();

    var existingVal = Utils.getPropertyValue({ property: { nestedProp: 'value' } }, 'property.nestedProp');
    expect(existingVal).toEqual('value');
  });

  it('tests elementHasClass', function() {
    var element = document.createElement('div');
    element.className = 'oo-icon';
    expect(Utils.elementHasClass(element, 'oo-icon')).toBe(true);
    element.className = 'fancy oo-icon pants';
    expect(Utils.elementHasClass(element, 'oo-icon')).toBe(true);
    element.className = 'fancy pants oo-icon';
    expect(Utils.elementHasClass(element, 'oo-icon')).toBe(true);
    element.className = 'fancy oo-icons pants';
    expect(Utils.elementHasClass(element, 'oo-icon')).toBe(false);
  });

  it('tests getEventIconElement', function() {
    var iconElement = document.createElement('span');
    var buttonElement = document.createElement('button');
    iconElement.className = 'oo-icon';
    buttonElement.appendChild(iconElement);

    var nestedIconElement = document.createElement('span');
    var divElement = document.createElement('div');
    var nestedDivElement = document.createElement('div');
    nestedIconElement.className = 'oo-custom-icon';
    divElement.appendChild(nestedDivElement);
    nestedDivElement.appendChild(nestedIconElement);

    var extractedElement1 = Utils.getEventIconElement({ currentTarget: buttonElement });
    expect(extractedElement1).toBe(iconElement);
    var extractedElement2 = Utils.getEventIconElement({ currentTarget: iconElement });
    expect(extractedElement2).toBe(iconElement);
    var extractedElement3 = Utils.getEventIconElement({ currentTarget: divElement }, 'oo-custom-icon');
    expect(extractedElement3).toBe(nestedIconElement);
  });

  it('tests highlight', function () {
    var div = document.createElement('div');
    var opacity = '0.6';
    var color = '#0000FF';
    Utils.highlight(div, opacity, color);
    expect(div.style.opacity).toBe(opacity);
    expect(div.style.color).toBe('rgb(0, 0, 255)');

    Utils.removeHighlight(div, '1', 'white');
    expect(div.style.opacity).toBe('1');
    expect(div.style.color).toBe('white');
    expect(div.style.filter).toBe('');
  });

  it('tests collapse', function () {
    var controlBarItems = [{"name":"playPause","location":"controlBar","whenDoesNotFit":"keep","minWidth":45},{"name":"volume","location":"controlBar","whenDoesNotFit":"keep","minWidth":240},{"name":"timeDuration","location":"controlBar","whenDoesNotFit":"drop","minWidth":145},{"name":"flexibleSpace","location":"controlBar","whenDoesNotFit":"keep","minWidth":1},{"name":"share","location":"controlBar","whenDoesNotFit":"moveToMoreOptions","minWidth":45},{"name":"discovery","location":"controlBar","whenDoesNotFit":"moveToMoreOptions","minWidth":45},{"name":"closedCaption","location":"controlBar","whenDoesNotFit":"moveToMoreOptions","minWidth":45},{"name":"quality","location":"controlBar","whenDoesNotFit":"moveToMoreOptions","minWidth":45},{"name":"logo","location":"controlBar","whenDoesNotFit":"keep","minWidth":125},{"name":"fullscreen","location":"controlBar","whenDoesNotFit":"keep","minWidth":45},{"name":"moreOptions","location":"controlBar","whenDoesNotFit":"keep","minWidth":45}];
    var items = Utils.collapse(600, controlBarItems, 1);
    expect(items.fit.length).toBe(6); expect(items.overflow.length).toBe(5);

    items = Utils.collapse(1200, controlBarItems, 1);
    expect(items.fit.length).toBe(11); expect(items.overflow.length).toBe(0);

    items = Utils.collapse(820, controlBarItems, 1);
    expect(items.fit.length).toBe(10); expect(items.overflow.length).toBe(1);

    items = Utils.collapse(320, controlBarItems, 0.7);
    expect(items.fit.length).toBe(6); expect(items.overflow.length).toBe(5);

    items = Utils.collapse(1280, controlBarItems, 1.2);
    expect(items.fit.length).toBe(11); expect(items.overflow.length).toBe(0);

    items = Utils.collapse('a', controlBarItems, 1);
    expect(items).toBe(controlBarItems);

    items = Utils.collapse(500, null, 1);
    expect(items).toEqual([]);
  });

  it('tests findThumbnail', function () {
    var thumbData = {"data":{"available_time_slices":[0,15,30,45,60,75,90],"available_widths":[96,426,1280],"thumbnails":{"0":{"96":{"width":96,"height":40,"url":"http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/Ut_HKthATH4eww8X4xMDoxOjAzO6fyGr"},"426":{"width":426,"height":181,"url":"http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/Ut_HKthATH4eww8X4xMDoxOmFkOxyVqc"},"1280":{"width":1280,"height":544,"url":"http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/Ut_HKthATH4eww8X4xMDoxOjA4MTsiGN"}},"15":{"96":{"width":96,"height":40,"url":"http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/3Gduepif0T1UGY8H4xMDoxOjAzO6fyGr"},"426":{"width":426,"height":181,"url":"http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/3Gduepif0T1UGY8H4xMDoxOmFkOxyVqc"},"1280":{"width":1280,"height":544,"url":"http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/3Gduepif0T1UGY8H4xMDoxOjA4MTsiGN"}},"30":{"96":{"width":96,"height":40,"url":"http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/QCdjB5HwFOTaWQ8X4xMDoxOjAzO6fyGr"},"426":{"width":426,"height":181,"url":"http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/QCdjB5HwFOTaWQ8X4xMDoxOmFkOxyVqc"},"1280":{"width":1280,"height":544,"url":"http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/QCdjB5HwFOTaWQ8X4xMDoxOjA4MTsiGN"}},"45":{"96":{"width":96,"height":40,"url":"http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/DLOokYc8UKM-fB9H4xMDoxOjAzO6fyGr"},"426":{"width":426,"height":181,"url":"http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/DLOokYc8UKM-fB9H4xMDoxOmFkOxyVqc"},"1280":{"width":1280,"height":544,"url":"http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/DLOokYc8UKM-fB9H4xMDoxOjA4MTsiGN"}},"60":{"96":{"width":96,"height":40,"url":"http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/PE3O6Z9ojHeNSk7H4xMDoxOjAzO6fyGr"},"426":{"width":426,"height":181,"url":"http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/PE3O6Z9ojHeNSk7H4xMDoxOmFkOxyVqc"},"1280":{"width":1280,"height":544,"url":"http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/PE3O6Z9ojHeNSk7H4xMDoxOjA4MTsiGN"}},"75":{"96":{"width":96,"height":40,"url":"http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/AZ2ZgMjz0LFGHCPn4xMDoxOjAzO6fyGr"},"426":{"width":426,"height":181,"url":"http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/AZ2ZgMjz0LFGHCPn4xMDoxOmFkOxyVqc"},"1280":{"width":1280,"height":544,"url":"http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/AZ2ZgMjz0LFGHCPn4xMDoxOjA4MTsiGN"}},"90":{"96":{"width":96,"height":40,"url":"http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/MGngRNnbuHoiqTJH4xMDoxOjAzO6fyGr"},"426":{"width":426,"height":181,"url":"http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/MGngRNnbuHoiqTJH4xMDoxOmFkOxyVqc"},"1280":{"width":1280,"height":544,"url":"http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/MGngRNnbuHoiqTJH4xMDoxOjA4MTsiGN"}}}}};
    var thumbs = Utils.findThumbnail(thumbData, 44, 888);
    expect(thumbs.pos).toBe(2);

    thumbs = Utils.findThumbnail(thumbData, 800, 888);
    expect(thumbs.pos).toBe(6);

    thumbs = Utils.findThumbnail(thumbData, 0, 888);
    thumbs = Utils.findThumbnail(thumbData, 15, 888);
    expect(thumbs.pos).toBe(1);

    thumbs = Utils.findThumbnail(thumbData, 33, 100);
    expect(thumbs.pos).toBe(2);
  });

  it('tests createMarkup', function () {
    var markup = 'This is &quot;markup&quot;';
    var html = Utils.createMarkup(markup);
    expect(html.__html).toBe(markup);
  });

  it('tests isValidString', function () {
    var src = null;
    var isValidString = Utils.isValidString(src);
    expect(isValidString).toBeFalsy();

    src = '';
    isValidString = Utils.isValidString(src);
    expect(isValidString).toBeFalsy();

    src = undefined;
    isValidString = Utils.isValidString(src);
    expect(isValidString).toBeFalsy();

    src = 'http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/3Gduepif0T1UGY8H4xMDoxOmFkOxyVqc';
    isValidString = Utils.isValidString(src);
    expect(isValidString).toBeTruthy();
  });

  it('tests sanitizeConfigData', function () {
    var data = null;
    var sanitizedConfigData = Utils.sanitizeConfigData(data);
    expect(sanitizedConfigData).toEqual({});

    data = '';
    sanitizedConfigData = Utils.sanitizeConfigData(data);
    expect(sanitizedConfigData).toEqual({});

    data = undefined;
    sanitizedConfigData = Utils.sanitizeConfigData(data);
    expect(sanitizedConfigData).toEqual({});

    data = [];
    sanitizedConfigData = Utils.sanitizeConfigData(data);
    expect(sanitizedConfigData).toEqual({});

    data = [1, 2, 3];
    sanitizedConfigData = Utils.sanitizeConfigData(data);
    expect(sanitizedConfigData).toEqual({});

    data = 'inline: {data: 2}';
    sanitizedConfigData = Utils.sanitizeConfigData(data);
    expect(sanitizedConfigData).toBe(data);

    data = 10;
    sanitizedConfigData = Utils.sanitizeConfigData(data);
    expect(sanitizedConfigData).toBe(data);

    data = {skin: {config: "v4"}};
    sanitizedConfigData = Utils.sanitizeConfigData(data);
    expect(sanitizedConfigData).toBeTruthy();
    expect(sanitizedConfigData.skin).toBeTruthy();
    expect(sanitizedConfigData.skin.config).toBe("v4");
  });

  it('tests deep merge', function () {
    var localSettings = {
      "closedCaptionOptions":{"windowColor":"Yellow","enabled":true, "backgroundOpacity":"0.2","textOpacity":"1"}
    };
    var inlinePageParams = {
      "closedCaptionOptions":{"textColor":"Blue", "backgroundColor":"Green","windowColor":"White","windowOpacity":0.5},
      "buttons":{"desktopContent":[{"name":"ooyala","location":"ooyala","whenDoesNotFit":"ooyala","minWidth":85},{"name":"quality","location":"controlBar","whenDoesNotFit":"moveToMoreOptions","minWidth":85}]}
    };
    var customSkinJSON = {
      "closedCaptionOptions":{"enabled":true,"language":"en","fontType":"Proportional Sans-Serif"},
      "buttons":{"desktopContent":[{"name":"alice","location":"alice","whenDoesNotFit":"keep","minWidth":53},{"name":"volume","location":"controlBar","whenDoesNotFit":"keep","minWidth":240},{"name":"live","location":"controlBar","whenDoesNotFit":"keep","minWidth":65},{"name":"quality","location":"controlBar","whenDoesNotFit":"ooyala","minWidth":95,"alice":"video"}]},
      "general":{"accentColor":"#448aff"}
    };
    var metaDataSettings = {
      "closedCaptionOptions":{"fontSize":"Large","windowColor":"Green"},
      "buttons":{"desktopContent":[{"name":"share","location":"controlBar","whenDoesNotFit":"moveToMoreOptions","minWidth":45,"enabled":true},{"name":"volume","location":"controlBar","whenDoesNotFit":"keep","minWidth":45,"enabled":true},{"name":"fullscreen","location":"controlBar","whenDoesNotFit":"keep","minWidth":55,"enabled":true},{"name":"quality","location":"controlBar","whenDoesNotFit":"moveToMoreOptions","minWidth":45,"enabled":true}]},"general":{"accentColor":"#ffbb00","watermark":{"imageResource":{"url":"http://ak.c.ooyala.com/Uzbm46asiensk3opIgwfFn5KFemv/watermark147585568"},"position":"top-left","clickUrl":"","transparency":0.51,"scalingOption":"none","scalingPercentage":0}},"shareScreen":{"shareContent":["social","ooyala"],"socialContent":["twitter","lisa","google+","jason"]}
    };
    var buttonArrayFusion = 'replace';

    var mergedMetaData = DeepMerge(SkinJSON, metaDataSettings, {arrayMerge: Utils.arrayDeepMerge.bind(Utils), arrayUnionBy:'name', arrayFusion:'deepmerge'});
    var finalConfig = DeepMerge.all([mergedMetaData, customSkinJSON, inlinePageParams, localSettings], {arrayMerge: Utils.arrayDeepMerge.bind(Utils), arrayUnionBy:'name', arrayFusion:'deepmerge', buttonArrayFusion:buttonArrayFusion});

    // test merge hierarchy, keys from 5 objects should be merged into one object with correct priority
    expect(finalConfig.closedCaptionOptions.textColor).toBe("Blue"); //from inlinePageParams
    expect(finalConfig.closedCaptionOptions.windowOpacity).toBe(0.5); //from inlinePageParams
    expect(finalConfig.closedCaptionOptions.backgroundColor).toBe("Green"); //from inlinePageParams
    expect(finalConfig.closedCaptionOptions.windowColor).toBe("Yellow"); //from localSettings
    expect(finalConfig.closedCaptionOptions.fontType).toBe("Proportional Sans-Serif"); //from customSkinJSON
    expect(finalConfig.closedCaptionOptions.fontSize).toBe("Large"); //from metaDataSettings
    expect(finalConfig.closedCaptionOptions.textEnhancement).toBe("Uniform"); //from SkinJSON

    // test array merge for buttons (replace)
    expect(finalConfig.buttons.desktopContent.length).toBe(inlinePageParams.buttons.desktopContent.length);
    // test basic array merge
    expect(finalConfig.shareScreen.shareContent[1]).toBe(SkinJSON.shareScreen.shareContent[1]);
    expect(finalConfig.shareScreen.shareContent[2]).toBe(metaDataSettings.shareScreen.shareContent[1]);
    expect(finalConfig.shareScreen.shareContent).toEqual(['social', 'embed', 'ooyala']);

    buttonArrayFusion = 'prepend';
    mergedMetaData = DeepMerge(SkinJSON, metaDataSettings, {arrayMerge: Utils.arrayDeepMerge.bind(Utils), arrayUnionBy:'name'});
    finalConfig = DeepMerge.all([mergedMetaData, customSkinJSON, inlinePageParams, localSettings], {arrayMerge: Utils.arrayDeepMerge.bind(Utils), arrayUnionBy:'name', buttonArrayFusion:buttonArrayFusion});

    // test basic array replace
    expect(finalConfig.shareScreen.shareContent[1]).not.toBe(SkinJSON.shareScreen.shareContent[1]);
    expect(finalConfig.shareScreen.shareContent).toEqual(['social', 'ooyala']);
    // test array merge for buttons (prepend)
    expect(finalConfig.buttons.desktopContent.length).toBe(16);
    // test new buttons are placed after flexibleSpace
    expect(finalConfig.buttons.desktopContent[4].name).toBe("flexibleSpace");
    expect(finalConfig.buttons.desktopContent[5].name).toBe("ooyala");
    expect(finalConfig.buttons.desktopContent[6].name).toBe("alice");
    expect(finalConfig.buttons.desktopContent[10].alice).toBe("video");
  });
});
