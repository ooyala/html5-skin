jest.dontMock('../../js/components/utils');
jest.dontMock('../../js/constants/constants');
jest.dontMock('deepmerge');
jest.dontMock('../../config/skin');

var Utils = require('../../js/components/utils');
var CONSTANTS = require('../../js/constants/constants');
var DeepMerge = require('deepmerge');
var SkinJSON = require('../../config/skin');
var _ = require('underscore');
OO = {
  log: function(a) {}
};

describe('Utils', function() {
  it('tests the utility functions', function() {
    var text = 'This is text. Really really long text that needs to be truncated to smaller text the fits on X amount of lines.';
    var div = document.createElement('div');
    div.getBoundingClientRect = function() {
      return {
        width: 20
      }
    };
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

  describe('getDiscoveryContext', function() {
    it('should return ooyalaDiscoveryContext if present', function() {
      var discoveryAsset = {"id" : "abcd", "ooyalaDiscoveryContext" : { "data": "something", "version" : "1"} };
      var context = Utils.getDiscoveryContext(discoveryAsset);
      expect(context.data).toEqual("something");
      expect(context.version).toEqual("1");
    });
    it('should return empty if asset is empty', function() {
      var context = Utils.getDiscoveryContext(null);
      expect(context).toEqual({});
    });
    it('should return empty if asset neither ooyalaDiscoveryContext or bucketInfo is present', function() {
      var context = Utils.getDiscoveryContext({"id" : "abcd"});
      expect(context).toEqual({});
    });
    it('should return converted ooyalaDiscoveryContext if bucketInfo is present', function() {
      var discoveryAsset = {"id" : "abcd", "bucket_info" : '2{"position":0, "encoded": "eyJ0ZXN0IjoiZGF0YSJ9"}' };
      var decodedExpected = {"test":"data"};
      var context = Utils.getDiscoveryContext(discoveryAsset);
      expect(context.data).toEqual(decodedExpected);
      expect(context.version).toEqual("1");
    });
  });

  describe('getDiscoveryEventData', function() {
    it('should return bundled data for discovery events', function() {
      var discoveryAsset = {"embed_code" : "abcd", "ooyalaDiscoveryContext" : { "data": "something", "version" : 1} };
      var customData = {"autoplay": false};
      var discoveryData = Utils.getDiscoveryEventData(1, 4, "test", discoveryAsset, customData);
      var expectedAsset = {"embed_code": discoveryAsset.embed_code, "idType":  CONSTANTS.DISCOVERY.ID_TYPE , "ooyalaDiscoveryContext" : { "data": "something", "version" : 1}};
      expect(discoveryData.assetPosition).toEqual(1);
      expect(discoveryData.pageSize).toEqual(4);
      expect(discoveryData.uiTag).toEqual("test");
      expect(discoveryData.contentSource).toEqual(CONSTANTS.DISCOVERY.SOURCE);
      expect(discoveryData.asset).toEqual(expectedAsset);
      expect(discoveryData.customData).toEqual(customData);
    });
  });

  describe('sortQualitiesByBitrate', function() {

    it('should gracefully handle invalid input', function() {
      expect(Array.isArray(Utils.sortQualitiesByBitrate({}))).toBe(true);
      expect(Array.isArray(Utils.sortQualitiesByBitrate([null, {}, { bitrate: '2000' }]))).toBe(true);
    });

    it('should sort qualities in descending order by bitrate then resolution', function() {
      var sourceBitrates = [ // Sorted by resolution by VTC
        { 'id': '4', 'width': 320, 'height': 180, 'bitrate': 1800000 },
        { 'id': '5', 'width': 320, 'height': 180, 'bitrate': 1200000 },
        { 'id': '3', 'width': 640, 'height': 360, 'bitrate': 2500000 },
        { 'id': '2', 'width': 640, 'height': 360, 'bitrate': 3300000 },
        { 'id': '1', 'width': 1280, 'height': 720, 'bitrate': 4400000 },
        { 'id': 'auto', 'width': 0, 'height': 0, 'bitrate': 0 }
      ];
      var sortedBitrates = [
        { 'id': '1', 'width': 1280, 'height': 720, 'bitrate': 4400000 },
        { 'id': '2', 'width': 640, 'height': 360, 'bitrate': 3300000 },
        { 'id': '3', 'width': 640, 'height': 360, 'bitrate': 2500000 },
        { 'id': '4', 'width': 320, 'height': 180, 'bitrate': 1800000 },
        { 'id': '5', 'width': 320, 'height': 180, 'bitrate': 1200000 },
        { 'id': 'auto', 'width': 0, 'height': 0, 'bitrate': 0 }
      ];
      expect(Utils.sortQualitiesByBitrate(sourceBitrates)).toEqual(sortedBitrates);
    });

    it('should give priority to bitrate over resolution when sorting', function() {
      var sourceBitrates = [ // Sorted by resolution by VTC
        { 'id': '1', 'width': 1280, 'height': 720, 'bitrate': 4400000 },
        { 'id': '2', 'width': 640, 'height': 360, 'bitrate': 3300000 },
        { 'id': '3', 'width': 640, 'height': 360, 'bitrate': 1200000 },
        { 'id': '4', 'width': 320, 'height': 180, 'bitrate': 1800000 },
        { 'id': '5', 'width': 320, 'height': 180, 'bitrate': 1200000 },
        { 'id': '6', 'width': 320, 'height': 180, 'bitrate': 400000 },
        { 'id': '7', 'width': 320, 'height': 180, 'bitrate': 150000 },
        { 'id': 'auto', 'width': 0, 'height': 0, 'bitrate': 0 }
      ];
      var sortedBitrates = [
        { 'id': '1', 'width': 1280, 'height': 720, 'bitrate': 4400000 },
        { 'id': '2', 'width': 640, 'height': 360, 'bitrate': 3300000 },
        { 'id': '4', 'width': 320, 'height': 180, 'bitrate': 1800000 },
        { 'id': '3', 'width': 640, 'height': 360, 'bitrate': 1200000 },
        { 'id': '5', 'width': 320, 'height': 180, 'bitrate': 1200000 },
        { 'id': '6', 'width': 320, 'height': 180, 'bitrate': 400000 },
        { 'id': '7', 'width': 320, 'height': 180, 'bitrate': 150000 },
        { 'id': 'auto', 'width': 0, 'height': 0, 'bitrate': 0 }
      ];
      expect(Utils.sortQualitiesByBitrate(sourceBitrates)).toEqual(sortedBitrates);
    });

  });

  describe('getSkipTimes', function() {
    let skinConfig;

    beforeEach(function() {
      skinConfig = {
        skipControls: {
          skipBackwardTime: 10,
          skipForwardTime: 10,
        }
      };
    });

    it('should extract values from skin config', function() {
      skinConfig.skipControls.skipBackwardTime = 5;
      skinConfig.skipControls.skipForwardTime = 15;
      expect(Utils.getSkipTimes(skinConfig)).toEqual({
        backward: 5,
        forward: 15
      });
    });

    it('should return default values when passing invalid data', function() {
      const defaults = {
        backward: CONSTANTS.UI.DEFAULT_SKIP_BACKWARD_TIME,
        forward: CONSTANTS.UI.DEFAULT_SKIP_FORWARD_TIME
      };
      expect(Utils.getSkipTimes(null)).toEqual(defaults);
      expect(Utils.getSkipTimes({})).toEqual(defaults);
      skinConfig.skipControls.skipBackwardTime = "abc";
      skinConfig.skipControls.skipForwardTime = {};
      expect(Utils.getSkipTimes(skinConfig)).toEqual(defaults);
      skinConfig.skipControls.skipBackwardTime = undefined;
      skinConfig.skipControls.skipForwardTime = undefined;
      expect(Utils.getSkipTimes(skinConfig)).toEqual(defaults);
    });

    it('should constrain to minimum and maximum values', function() {
      skinConfig.skipControls.skipBackwardTime = -1;
      skinConfig.skipControls.skipForwardTime = -1;
      expect(Utils.getSkipTimes(skinConfig)).toEqual({
        backward: CONSTANTS.UI.MIN_SKIP_TIME,
        forward: CONSTANTS.UI.MIN_SKIP_TIME
      });
      skinConfig.skipControls.skipBackwardTime = 150;
      skinConfig.skipControls.skipForwardTime = 150;
      expect(Utils.getSkipTimes(skinConfig)).toEqual({
        backward: CONSTANTS.UI.MAX_SKIP_TIME,
        forward: CONSTANTS.UI.MAX_SKIP_TIME
      });
    });

    it('should enforce integer values', function() {
      skinConfig.skipControls.skipBackwardTime = 10.05;
      skinConfig.skipControls.skipForwardTime = 20.123232;
      expect(Utils.getSkipTimes(skinConfig)).toEqual({
        backward: 10,
        forward: 20
      });
    });
  });

  describe('sanitizePlaybackSpeed', function() {

    it('should return numerical version of value', function() {
      expect(Utils.sanitizePlaybackSpeed('2')).toBe(2);
      expect(Utils.sanitizePlaybackSpeed('1.25')).toBe(1.25);
      expect(Utils.sanitizePlaybackSpeed('.5')).toBe(0.5);
    });

    it('should truncate values to at most two decimals', function() {
      expect(Utils.sanitizePlaybackSpeed(0.55444)).toBe(0.55);
      expect(Utils.sanitizePlaybackSpeed(0.77777)).toBe(0.78);
      expect(Utils.sanitizePlaybackSpeed('1.33333')).toBe(1.33);
    });

    it('should constrain to min and max values when ignoreMinMax is false', function() {
      expect(Utils.sanitizePlaybackSpeed(CONSTANTS.PLAYBACK_SPEED.MIN - 1, false)).toBe(CONSTANTS.PLAYBACK_SPEED.MIN);
      expect(Utils.sanitizePlaybackSpeed(CONSTANTS.PLAYBACK_SPEED.MAX + 1, false)).toBe(CONSTANTS.PLAYBACK_SPEED.MAX);
    });

    it('should NOT constrain to min and max values when ignoreMinMax is true', function() {
      expect(Utils.sanitizePlaybackSpeed(CONSTANTS.PLAYBACK_SPEED.MIN - 1, true)).toBe(CONSTANTS.PLAYBACK_SPEED.MIN - 1);
      expect(Utils.sanitizePlaybackSpeed(CONSTANTS.PLAYBACK_SPEED.MAX + 1, true)).toBe(CONSTANTS.PLAYBACK_SPEED.MAX + 1);
    });

  });

  describe('dedupeArray', function() {

    it('should return a new array', function() {
      const array = [1, 2, 3];
      expect(Utils.dedupeArray(array)).not.toBe(array);
      expect(Utils.dedupeArray(array)).toEqual(array);
    });

    it('should remove duplicate values from array', function() {
      expect(Utils.dedupeArray([1, 2, 1, 2, 3])).toEqual([1, 2, 3]);
      expect(Utils.dedupeArray(['1', '2', '1', '2', '3'])).toEqual(['1', '2', '3']);
      const obj = { prop: 1 };
      expect(Utils.dedupeArray([{}, obj, obj, { a: 2 }, obj])).toEqual([{}, obj, { a: 2 }]);
    });

    it('should return an empty array when input is not an array', function() {
      expect(Utils.dedupeArray({})).toEqual([]);
      expect(Utils.dedupeArray(3)).toEqual([]);
      expect(Utils.dedupeArray('3')).toEqual([]);
    });

  });

  describe('isMouseInsideRect', function() {
    let mousePosition, clientRect;

    beforeEach(function() {
      mousePosition = {
        clientX: 0,
        clientY: 0
      };
      clientRect = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      };
    });

    it('should return true when mouse position is inside rect', function() {
      mousePosition.clientX = 50;
      mousePosition.clientY = 50;
      clientRect.right = 100;
      clientRect.bottom = 100;
      expect(Utils.isMouseInsideRect(mousePosition, clientRect)).toBe(true);
      mousePosition.clientX = 0;
      mousePosition.clientY = 100;
      expect(Utils.isMouseInsideRect(mousePosition, clientRect)).toBe(true);
    });

    it('should return false when mouse position is outside rect', function() {
      mousePosition.clientX = 120;
      mousePosition.clientY = 50;
      clientRect.right = 100;
      clientRect.bottom = 100;
      expect(Utils.isMouseInsideRect(mousePosition, clientRect)).toBe(false);
      mousePosition.clientX = -1;
      mousePosition.clientY = 50;
      expect(Utils.isMouseInsideRect(mousePosition, clientRect)).toBe(false);
    });

    it('should return false when invalid values are passed', function() {
      mousePosition.clientX = null;
      mousePosition.clientY = undefined;
      clientRect.right = 100;
      clientRect.bottom = 100;
      expect(Utils.isMouseInsideRect(mousePosition, clientRect)).toBe(false);
      expect(Utils.isMouseInsideRect(null, null)).toBe(false);
    });

  });

  describe('getCurrentTimestamp', function() {

    it('should return a numerical timestamp', function() {
      expect(_.isNumber(Utils.getCurrentTimestamp())).toBe(true);
    });

  });

  it('tests isSafari', function() {
    OO_setWindowNavigatorProperty('userAgent', 'AppleWebKit');
    var isSafari = Utils.isSafari();
    expect(isSafari).toBeTruthy();
    OO_setWindowNavigatorProperty('userAgent', 'jsdom');
    isSafari = Utils.isSafari();
    expect(isSafari).toBeFalsy();
  });

  it('tests isEdge', function() {
    OO_setWindowNavigatorProperty('userAgent', 'Edge');
    var isEdge = Utils.isEdge();
    expect(isEdge).toBeTruthy();
    OO_setWindowNavigatorProperty('userAgent', 'jsdom');
    isEdge = Utils.isEdge();
    expect(isEdge).toBeFalsy();
  });

  it('tests isIE', function() {
    OO_setWindowNavigatorProperty('userAgent', 'MSIE');
    var isIE = Utils.isIE();
    expect(isIE).toBeTruthy();
    OO_setWindowNavigatorProperty('userAgent', 'jsdom');
    isIE = Utils.isIE();
    expect(isIE).toBeFalsy();
  });

  it('tests isAndroid', function() {
    OO_setWindowNavigatorProperty('appVersion', 'Android');
    var isAndroid = Utils.isAndroid();
    expect(isAndroid).toBeTruthy();
    OO_setWindowNavigatorProperty('appVersion', 'jsdom');
    isAndroid = Utils.isAndroid();
    expect(isAndroid).toBeFalsy();
  });

  it('tests isIos', function() {
    OO_setWindowNavigatorProperty('platform', 'iPhone');
    var isIos = Utils.isIos();
    expect(isIos).toBeTruthy();
    OO_setWindowNavigatorProperty('platform', 'jsdom');
    isIos = Utils.isIos();
    expect(isIos).toBeFalsy();
  });

  it('tests isIPhone', function() {
    OO_setWindowNavigatorProperty('platform', 'iPod');
    var isIPhone = Utils.isIPhone();
    expect(isIPhone).toBeTruthy();
    OO_setWindowNavigatorProperty('platform', 'jsdom');
    isIPhone = Utils.isIPhone();
    expect(isIPhone).toBeFalsy();
  });

  it('tests isMobile', function() {
    OO_setWindowNavigatorProperty('platform', 'iPod');
    var isMobile = Utils.isMobile();
    expect(isMobile).toBeTruthy();
    OO_setWindowNavigatorProperty('platform', 'jsdom');
    isMobile = Utils.isMobile();
    expect(isMobile).toBeFalsy();
  });

  it('tests isIE10', function() {
    OO_setWindowNavigatorProperty('userAgent', 'MSIE 10');
    var isIE10 = Utils.isIE10();
    expect(isIE10).toBeTruthy();
    OO_setWindowNavigatorProperty('userAgent', 'jsdom');
    isIE10 = Utils.isIE10();
    expect(isIE10).toBeFalsy();
  });

  describe('tests getDefaultLanguage', function() {
    it('should return an empty string if param "localization" is wrong type', function(){
      const emptyToParam = Utils.getDefaultLanguage();
      expect(emptyToParam).toBe('');
      const nullToParam = Utils.getDefaultLanguage(null);
      expect(nullToParam).toBe('');
      const arrayToParam = Utils.getDefaultLanguage([1, 2, 3]);
      expect(arrayToParam).toBe('');
    });

    it('should return an empty string if param "localization" does not have field "defaultLanguage',
      function() {
        const defaultLanguage = Utils.getDefaultLanguage({'test': 1});
        expect(defaultLanguage).toBe('');
      }
    );

    it('should return "defaultLanguage" from "localization" object', function(){
      const defaultLanguage = Utils.getDefaultLanguage({'defaultLanguage': 'en'});
      expect(defaultLanguage).toBe('en');
    });
  });

  describe('tests getLanguageToUse', function() {
    let skinConfig = {
      localization: {
        defaultLanguage: 'zh'
      }
    };
    beforeEach(function() {});

    afterEach(function() {
      skinConfig = {
        localization: {
          defaultLanguage: 'zh'
        }
      };
    });

    it('should return an empty string if there is no skinConfig', function() {
      const getLanguageToUse = Utils.getLanguageToUse();
      expect(getLanguageToUse).toBe('');
    });
    it('should return an empty string if skinConfig does not have "defaultLanguage" and ' +
      'browser language is unknown' , function() {
      skinConfig = {};
      const getLanguageToUse = Utils.getLanguageToUse(skinConfig);
      expect(getLanguageToUse).toBe('');
    });
    it('should return zh if "defaultLanguage" === "zh" and browser language is unknown', function() {
      const getLanguageToUse = Utils.getLanguageToUse(skinConfig);
      expect(getLanguageToUse).toBe('zh');
    });
    it('should return es if browser language is "es" and this vale is in "availableLanguageFile"', function() {
      skinConfig = {
        localization: {
          defaultLanguage: 'en',
          availableLanguageFile: [
            {
              'language': 'en',
              'languageFile': '//player.ooyala.com/static/v4/candidate/latest/skin-plugin/en.json',
              'androidResource': 'skin-config/en.json',
              'iosResource': 'en'
            },
            {
              'language': 'es',
              'languageFile': '//player.ooyala.com/static/v4/candidate/latest/skin-plugin/es.json',
              'androidResource': 'skin-config/es.json',
              'iosResource': 'es'
            },
            {
              'language': 'zh',
              'languageFile': '//player.ooyala.com/static/v4/candidate/latest/skin-plugin/zh.json',
              'androidResource': 'skin-config/zh.json',
              'iosResource': 'zh'
            }
          ]
        }
      };
      OO_setWindowNavigatorProperty('language', 'es-US');
      const getLanguageToUse = Utils.getLanguageToUse(skinConfig);
      expect(getLanguageToUse).toBe('es');
    });
  });

  it('tests getLocalizedString', function() {
    var text = 'This is the share page';
    var localizedString = Utils.getLocalizedString('en', 'shareText', {en: {shareText: text}});
    expect(localizedString).toBe(text);

    localizedString = Utils.getLocalizedString(null, null, null);
    expect(localizedString).toBe(null);
  });

  it('tests getStartCountdown', function() {
    var text = '6 days, 5 hours, and 14 minutes';
    var countDownText = Utils.getStartCountdown(537289879);
    expect(countDownText).toBe(text);

    var localizedString = Utils.getStartCountdown(-100000000);
    expect(localizedString).toBe('');
  });

  it('tests getPropertyValue', function() {
    var defaultVal = Utils.getPropertyValue({}, 'property.nestedProp', 'default');
    expect(defaultVal).toEqual('default');

    var undefinedVal = Utils.getPropertyValue({}, 'property.nestedProp');
    expect(undefinedVal).toBeUndefined();

    var existingVal = Utils.getPropertyValue({ property: { nestedProp: 'value' } }, 'property.nestedProp');
    expect(existingVal).toEqual('value');

    // comaparing the falsy values with === so I'm sure types match and that there is no implicit conversion.
    var falsyVal = Utils.getPropertyValue({ property: { nestedProp: 0 } }, 'property.nestedProp', 1);
    expect(falsyVal === 0).toEqual(true);

    falsyVal = Utils.getPropertyValue({ property: { nestedProp: null } }, 'property.nestedProp', 1);
    expect(falsyVal === null).toEqual(true);

    var stringVal = Utils.getPropertyValue({ property: { nestedProp: { test:'test' } } }, 'property.nestedProp.test', 1);
    expect(stringVal === 'test').toEqual(true);

    var functionVal = Utils.getPropertyValue({ property: { nestedProp: { test:'test' } } }, 'property.nestedProp.toString', 1);
    expect(typeof functionVal === 'function').toEqual(true);

    var myFunc = function() { return 'myTestFunc'; };
    functionVal = Utils.getPropertyValue({ property: { nestedProp: { func: myFunc } } }, 'property.nestedProp.func', 1);
    expect(functionVal() === 'myTestFunc').toEqual(true);
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

  it('tests highlight', function() {
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

  it('tests collapse', function() {
    var controlBarItems = [{'name':'playPause','location':'controlBar','whenDoesNotFit':'keep','minWidth':45},{'name':'volume','location':'controlBar','whenDoesNotFit':'keep','minWidth':240},{'name':'timeDuration','location':'controlBar','whenDoesNotFit':'drop','minWidth':145},{'name':'flexibleSpace','location':'controlBar','whenDoesNotFit':'keep','minWidth':1},{'name':'share','location':'controlBar','whenDoesNotFit':'moveToMoreOptions','minWidth':45},{'name':'discovery','location':'controlBar','whenDoesNotFit':'moveToMoreOptions','minWidth':45},{'name':'closedCaption','location':'controlBar','whenDoesNotFit':'moveToMoreOptions','minWidth':45},{'name':'quality','location':'controlBar','whenDoesNotFit':'moveToMoreOptions','minWidth':45},{'name':'logo','location':'controlBar','whenDoesNotFit':'keep','minWidth':125},{'name':'fullscreen','location':'controlBar','whenDoesNotFit':'keep','minWidth':45},{'name':'moreOptions','location':'controlBar','whenDoesNotFit':'keep','minWidth':45}];
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

  it('tests findThumbnail', function() {
    var thumbData = {'data':{'available_time_slices':[0,15,30,45,60,75,90],'available_widths':[96,426,1280],'thumbnails':{'0':{'96':{'width':96,'height':40,'url':'http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/Ut_HKthATH4eww8X4xMDoxOjAzO6fyGr'},'426':{'width':426,'height':181,'url':'http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/Ut_HKthATH4eww8X4xMDoxOmFkOxyVqc'},'1280':{'width':1280,'height':544,'url':'http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/Ut_HKthATH4eww8X4xMDoxOjA4MTsiGN'}},'15':{'96':{'width':96,'height':40,'url':'http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/3Gduepif0T1UGY8H4xMDoxOjAzO6fyGr'},'426':{'width':426,'height':181,'url':'http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/3Gduepif0T1UGY8H4xMDoxOmFkOxyVqc'},'1280':{'width':1280,'height':544,'url':'http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/3Gduepif0T1UGY8H4xMDoxOjA4MTsiGN'}},'30':{'96':{'width':96,'height':40,'url':'http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/QCdjB5HwFOTaWQ8X4xMDoxOjAzO6fyGr'},'426':{'width':426,'height':181,'url':'http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/QCdjB5HwFOTaWQ8X4xMDoxOmFkOxyVqc'},'1280':{'width':1280,'height':544,'url':'http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/QCdjB5HwFOTaWQ8X4xMDoxOjA4MTsiGN'}},'45':{'96':{'width':96,'height':40,'url':'http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/DLOokYc8UKM-fB9H4xMDoxOjAzO6fyGr'},'426':{'width':426,'height':181,'url':'http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/DLOokYc8UKM-fB9H4xMDoxOmFkOxyVqc'},'1280':{'width':1280,'height':544,'url':'http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/DLOokYc8UKM-fB9H4xMDoxOjA4MTsiGN'}},'60':{'96':{'width':96,'height':40,'url':'http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/PE3O6Z9ojHeNSk7H4xMDoxOjAzO6fyGr'},'426':{'width':426,'height':181,'url':'http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/PE3O6Z9ojHeNSk7H4xMDoxOmFkOxyVqc'},'1280':{'width':1280,'height':544,'url':'http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/PE3O6Z9ojHeNSk7H4xMDoxOjA4MTsiGN'}},'75':{'96':{'width':96,'height':40,'url':'http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/AZ2ZgMjz0LFGHCPn4xMDoxOjAzO6fyGr'},'426':{'width':426,'height':181,'url':'http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/AZ2ZgMjz0LFGHCPn4xMDoxOmFkOxyVqc'},'1280':{'width':1280,'height':544,'url':'http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/AZ2ZgMjz0LFGHCPn4xMDoxOjA4MTsiGN'}},'90':{'96':{'width':96,'height':40,'url':'http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/MGngRNnbuHoiqTJH4xMDoxOjAzO6fyGr'},'426':{'width':426,'height':181,'url':'http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/MGngRNnbuHoiqTJH4xMDoxOmFkOxyVqc'},'1280':{'width':1280,'height':544,'url':'http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/MGngRNnbuHoiqTJH4xMDoxOjA4MTsiGN'}}}}};
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

  it('tests createMarkup', function() {
    var markup = 'This is &quot;markup&quot;';
    var html = Utils.createMarkup(markup);
    expect(html.__html).toBe(markup);
  });

  it('tests isValidString', function() {
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

  it('tests sanitizeConfigData', function() {
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

    data = {skin: {config: 'v4'}};
    sanitizedConfigData = Utils.sanitizeConfigData(data);
    expect(sanitizedConfigData).toBeTruthy();
    expect(sanitizedConfigData.skin).toBeTruthy();
    expect(sanitizedConfigData.skin.config).toBe('v4');
  });

  it('tests deep merge', function() {
    var localSettings = {
      'closedCaptionOptions':{'windowColor':'Yellow','enabled':true, 'backgroundOpacity':'0.2','textOpacity':'1'}
    };
    var inlinePageParams = {
      'closedCaptionOptions':{'textColor':'Blue', 'backgroundColor':'Green','windowColor':'White','windowOpacity':0.5},
      'buttons':{'desktopContent':[{'name':'ooyala','location':'ooyala','whenDoesNotFit':'ooyala','minWidth':85},{'name':'quality','location':'controlBar','whenDoesNotFit':'moveToMoreOptions','minWidth':85}]}
    };
    var customSkinJSON = {
      'closedCaptionOptions':{'enabled':true,'language':'en','fontType':'Proportional Sans-Serif'},
      'buttons':{'desktopContent':[{'name':'alice','location':'alice','whenDoesNotFit':'keep','minWidth':53},{'name':'volume','location':'controlBar','whenDoesNotFit':'keep','minWidth':240},{'name':'live','location':'controlBar','whenDoesNotFit':'keep','minWidth':65},{'name':'quality','location':'controlBar','whenDoesNotFit':'ooyala','minWidth':95,'alice':'video'}]},
      'general':{'accentColor':'#448aff'}
    };
    var metaDataSettings = {
      'closedCaptionOptions':{'fontSize':'Large','windowColor':'Green'},
      'buttons':{'desktopContent':[{'name':'share','location':'controlBar','whenDoesNotFit':'moveToMoreOptions','minWidth':45,'enabled':true},{'name':'volume','location':'controlBar','whenDoesNotFit':'keep','minWidth':45,'enabled':true},{'name':'fullscreen','location':'controlBar','whenDoesNotFit':'keep','minWidth':55,'enabled':true},{'name':'quality','location':'controlBar','whenDoesNotFit':'moveToMoreOptions','minWidth':45,'enabled':true}]},'general':{'accentColor':'#ffbb00','watermark':{'imageResource':{'url':'http://ak.c.ooyala.com/Uzbm46asiensk3opIgwfFn5KFemv/watermark147585568'},'position':'top-left','clickUrl':'','transparency':0.51,'scalingOption':'none','scalingPercentage':0}},'shareScreen':{'shareContent':['social','ooyala'],'socialContent':['twitter','lisa','google+','jason']}
    };
    var buttonArrayFusion = 'replace';

    var mergedMetaData = DeepMerge(SkinJSON, metaDataSettings, {arrayMerge: Utils.arrayDeepMerge.bind(Utils), arrayUnionBy:'name', arrayFusion:'deepmerge'});
    var finalConfig = DeepMerge.all([mergedMetaData, customSkinJSON, inlinePageParams, localSettings], {arrayMerge: Utils.arrayDeepMerge.bind(Utils), arrayUnionBy:'name', arrayFusion:'deepmerge', buttonArrayFusion:buttonArrayFusion});

    // test merge hierarchy, keys from 5 objects should be merged into one object with correct priority
    expect(finalConfig.closedCaptionOptions.textColor).toBe('Blue'); // from inlinePageParams
    expect(finalConfig.closedCaptionOptions.windowOpacity).toBe(0.5); // from inlinePageParams
    expect(finalConfig.closedCaptionOptions.backgroundColor).toBe('Green'); // from inlinePageParams
    expect(finalConfig.closedCaptionOptions.windowColor).toBe('Yellow'); // from localSettings
    expect(finalConfig.closedCaptionOptions.fontType).toBe('Proportional Sans-Serif'); // from customSkinJSON
    expect(finalConfig.closedCaptionOptions.fontSize).toBe('Large'); // from metaDataSettings
    expect(finalConfig.closedCaptionOptions.textEnhancement).toBe('Uniform'); // from SkinJSON

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
    expect(finalConfig.buttons.desktopContent.length).toBe(18);
    // test new buttons are placed after flexibleSpace
    expect(finalConfig.buttons.desktopContent[4].name).toBe('flexibleSpace');
    expect(finalConfig.buttons.desktopContent[5].name).toBe('ooyala');
    expect(finalConfig.buttons.desktopContent[6].name).toBe('alice');
    expect(finalConfig.buttons.desktopContent[11].alice).toBe('video');
  });

  it('tests getUserDevice', function() {
    OO_setWindowNavigatorProperty('userAgent', 'Phone');
    var device = Utils.getUserDevice();
    expect(device).toBe('phone');
    OO_setWindowNavigatorProperty('userAgent', 'Tablet');
    device = Utils.getUserDevice();
    expect(device).toBe('tablet');
    OO_setWindowNavigatorProperty('userAgent', 'Webkit');
    device = Utils.getUserDevice();
    expect(device).toBe('desktop');
  });

  it('tests getPlayButtonDetails', function() {
    let playingDetails = Utils.getPlayButtonDetails(CONSTANTS.STATE.PAUSE);
    expect(playingDetails).toEqual({
      icon: 'play',
      ariaLabel: CONSTANTS.ARIA_LABELS.PLAY,
      buttonTooltip: CONSTANTS.SKIN_TEXT.PLAY
    });

    playingDetails = Utils.getPlayButtonDetails(CONSTANTS.STATE.PLAYING);
    expect(playingDetails).toEqual({
      icon: 'pause',
      ariaLabel: CONSTANTS.ARIA_LABELS.PAUSE,
      buttonTooltip: CONSTANTS.SKIN_TEXT.PAUSE
    });

    playingDetails = Utils.getPlayButtonDetails(CONSTANTS.STATE.END);
    expect(playingDetails).toEqual({
      icon: 'replay',
      ariaLabel: CONSTANTS.ARIA_LABELS.REPLAY,
      buttonTooltip: CONSTANTS.SKIN_TEXT.REPLAY
    });
  });
});
