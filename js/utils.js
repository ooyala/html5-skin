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

   calculateTextWidth: function(text, font) {
    var canvas = this.canvas || (this.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var textWidth = context.measureText(text);
    return textWidth.width;
  },

  truncateTextToSpecifiedWidth: function(width, text, textFont) {
    var actualWidth = width;
    var textWidth = Utils.calculateTextWidth(text, textFont);
    var truncatedText = "";
    if (textWidth > (actualWidth * 1.5)){
      var truncPercent = actualWidth / textWidth;
      var newWidth = (Math.floor(truncPercent * text.length) * 1.5) - 3;
      truncatedText = text.slice(0,newWidth) + "...";
    }
    else {
      truncatedText = text;
    }
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
    }
};