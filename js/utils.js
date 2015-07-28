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
      truncatedText = text.slice(0,newWidth) + "...";
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

    //check if browser is Safari
  isSafari: function () {
      return !!window.navigator.userAgent.match(/AppleWebKit/);
  },


  // Liusha: saved for resizing control bar
  getScaledControlBarHeight: function(controlBarWidth) {
    var controlBarHeightBase = 60;
    var controlBarHeight = 0;
    if (controlBarWidth >= 1280) {
      controlBarHeight = controlBarHeightBase * controlBarWidth / 1280;
    } else if (controlBarWidth <= 560) {
      controlBarHeight = controlBarHeightBase * controlBarWidth / 560;
    } else {
      controlBarHeight = controlBarHeightBase;
    }
    return controlBarHeight;   
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
  },
};