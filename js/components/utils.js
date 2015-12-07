CONSTANTS = require('./../constants/constants');

var Utils = {
  truncateTextToWidth: function(element, text) {
    var testText = document.createElement("span");
    testText.style.visibility = "hidden";
    testText.style.position = "absolute";
    testText.style.top = "0";
    testText.style.left = "0";
    testText.style.whiteSpace = "nowrap";
    testText.innerHTML = text;
    element.appendChild(testText);
    var actualWidth = element.clientWidth;
    var textWidth = testText.scrollWidth;
    var truncatedText = "";
    if (textWidth > (actualWidth * 1.8)){
      var truncPercent = actualWidth / textWidth;
      var newWidth = (Math.floor(truncPercent * text.length) * 1.8) - 3;
      truncatedText = text.slice(0,newWidth) + "&hellip;";
    }
    else {
      truncatedText = text;
    }
    element.removeChild(testText);
    return truncatedText;
  },

  clone: function(object) {
    var clonedObj = {};
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        clonedObj[key] = object[key];
      }
    }
    return clonedObj;
  },

  extend: function(original, toMerge) {
    var extendedObject = Utils.clone(original);
    for (var key in toMerge) {
      if (toMerge.hasOwnProperty(key)) {
        extendedObject[key] = toMerge[key];
      }
    }
    return extendedObject;
  },
  /**
    Convert raw seconds into human friendly HH:MM format
    @method formatSeconds
    @param {integer} timeInSeconds The time to format in seconds
    @return {String} The time as a string in the HH:MM format
  */
  formatSeconds: function(timeInSeconds) {
    var seconds = parseInt(timeInSeconds,10) % 60;
    var hours = parseInt(timeInSeconds / 3600, 10);
    var minutes = parseInt((timeInSeconds - hours * 3600) / 60, 10);

    if (hours < 10) {
      hours = '0' + hours;
    }

    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    return (parseInt(hours,10) > 0) ? (hours + ":" + minutes + ":" + seconds) : (minutes + ":" + seconds);
  },

  validateEmail: function(email) {
    // RFC 2822 compliant regex
    var regEx = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
    return regEx.test(email);
  },

    //check if browser is Safari
  isSafari: function () {
      return !!window.navigator.userAgent.match(/AppleWebKit/);
  },

  isAndroid: function() {
    var os = window.navigator.appVersion;
    return !!os.match(/Android/);
  },

  isIos: function() {
    var platform = window.navigator.platform;
    return !!(platform.match(/iPhone/) || platform.match(/iPad/) || platform.match(/iPod/));
  },

  isIPhone: function() {
    var platform = window.navigator.platform;
    return !!(platform.match(/iPhone/) || platform.match(/iPod/));
  },

  isMobile: function() {
    return (this.isAndroid() || this.isIos());
  },

  isIE10: function() {
    return !!window.navigator.userAgent.match(/MSIE 10/);
  },

  // Liusha: saved for resizing control bar
  getScaledControlBarHeight: function(controlBarWidth) {
    var controlBarHeightBase = CONSTANTS.UI.defaultControlBarHeight;
    // if (controlBarWidth >= 1280) {
    //   controlBarHeight = controlBarHeightBase * controlBarWidth / 1280;
    // } else if (controlBarWidth <= 560) {
    //   controlBarHeight = controlBarHeightBase * controlBarWidth / 560;
    // } else {
    //   controlBarHeight = controlBarHeightBase;
    // }
    return controlBarHeightBase;
  },

  getLanguageToUse: function(skinConfig) {
    var localization = skinConfig.localization;
    var language, availableLanguages;

    // set lang to default lang in skin config
    language = localization.defaultLanguage;

    // if no default lang in skin config check browser lang settings
    if(!language) {
      if(window.navigator.languages){
        // A String, representing the language version of the browser.
        // Examples of valid language codes are: "en", "en-US", "de", "fr", etc.
        language = window.navigator.languages[0];
      }
      else {
        // window.navigator.browserLanguage: current operating system language
        // window.navigator.userLanguage: operating system's natural language setting
        // window.navigator.language: the preferred language of the user, usually the language of the browser UI
        language = window.navigator.browserLanguage || window.navigator.userLanguage || window.navigator.language;
      }

      // remove lang sub-code
      var primaryLanguage = language.substr(0,2);

      // check available lang file for browser lang
      for(var i = 0; i < localization.availableLanguageFile.length; i++) {
        availableLanguages = localization.availableLanguageFile[i];
        // if lang file available set lang to browser primary lang
        if (primaryLanguage == availableLanguages.language){
          language = primaryLanguage;
        }
      }
    }
    return language;
  },

  getLocalizedString: function(language, stringId, localizedStrings) {
    try {
      return localizedStrings[language][stringId];
    } catch (e) {
      return "";
    }

  },

  highlight: function(target, opacity, color) {
    target.style.opacity = opacity;
    target.style.color = color;
    target.style.WebkitFilter = "drop-shadow(0px 0px 3px rgba(255,255,255,0.8))";
    target.style.filter = "drop-shadow(0px 0px 3px rgba(255,255,255,0.8))";
    target.style.msFilter = "progid:DXImageTransform.Microsoft.Dropshadow(OffX=0, OffY=0, Color='#fff')";
  },

  removeHighlight: function(target, opacity, color) {
    target.style.opacity = opacity;
    target.style.color = color;
    target.style.WebkitFilter = "";
    target.style.filter = "";
    target.style.msFilter = "";
  },

  /********************************************************************
  Collapsing control bar related code
  *********************************************************************/

  // @param barWidth numeric.
  // @param orderedItems array of left to right ordered items. Each item meets the skin's "button" schema.
  // @return {fit:[items that fit in the barWidth], overflow:[items that did not fit]}.
  // Note: items which do not meet the item spec will be removed and not appear in the results.
  collapse: function( barWidth, orderedItems ) {
    if( isNaN( barWidth ) || barWidth === undefined ) { return orderedItems; }
    if( ! orderedItems ) { return []; }
    var self = this;
    var validItems = orderedItems.filter( function(item) { return self._isValid(item); } );
    var r = this._collapse( barWidth, validItems );
    return r;
  },

  _isValid: function( item ) {
    var valid = (
      item &&
      item.location == "moreOptions" ||
      (item.location == "controlBar" &&
        item.whenDoesNotFit &&
        item.minWidth !== undefined &&
        item.minWidth >= 0)
    );
    return valid;
  },

  _collapse: function( barWidth, orderedItems ) {
    var r = { fit : orderedItems.slice(), overflow : [] };
    var usedWidth = orderedItems.reduce( function(p,c,i,a) { return p+c.minWidth; }, 0 );
    for( var i = orderedItems.length-1; i >= 0; --i ) {
      var item = orderedItems[ i ];
      if( this._isOnlyInMoreOptions(item) ) {
        usedWidth = this._collapseLastItemMatching(r, item, usedWidth);
      }
      if( usedWidth > barWidth && this._isCollapsable(item) ) {
        usedWidth = this._collapseLastItemMatching(r, item, usedWidth);
      }
    }
    return r;
  },

  _isOnlyInMoreOptions: function( item ) {
    var must = item.location == "moreOptions";
    return must;
  },

  _isCollapsable: function( item ) {
    var collapsable = item.location == "controlBar" && item.whenDoesNotFit && item.whenDoesNotFit != "keep";
    return collapsable;
  },

  _collapseLastItemMatching: function( results, item, usedWidth ) {
    var i = results.fit.lastIndexOf( item );
    if( i > -1 ) {
      results.fit.splice( i, 1 );
      results.overflow.unshift( item );
      if( item.minWidth ) {
        usedWidth -= item.minWidth;
      }
    }
    return usedWidth;
  },

  _isOverflow: function( item ) {
    return item.whenDoesNotFit && item.whenDoesNotFit == "moveToMoreOptions";
  }
};
module.exports = Utils;