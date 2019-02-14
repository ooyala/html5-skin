import DeepMerge from 'deepmerge';
import CONSTANTS from '../constants/constants';

const isValid = (item) => {
  const valid = (item && item.location === 'moreOptions')
    || (item.location === 'controlBar'
      && item.whenDoesNotFit
      && item.minWidth !== undefined
      && item.minWidth >= 0);
  return valid;
};

const isCollapsable = item => item.location === 'controlBar'
  && item.whenDoesNotFit
  && item.whenDoesNotFit !== 'keep';

const collapseLastItemMatching = (results, item, usedWidthDirty) => {
  const index = results.fit.lastIndexOf(item);
  let usedWidth = usedWidthDirty;
  if (index > -1) {
    results.fit.splice(index, 1);
    results.overflow.unshift(item);
    if (item.minWidth) {
      usedWidth -= item.minWidth;
    }
  }
  return usedWidth;
};

const collapse = (barWidth, orderedItems, responsiveUIMultiple) => {
  const result = { fit: orderedItems.slice(), overflow: [] };
  let usedWidth = orderedItems.reduce((memo, value) => (memo + responsiveUIMultiple * value.minWidth), 0);
  for (let index = orderedItems.length - 1; index >= 0; index -= 1) {
    const item = orderedItems[index];
    if (item.location === 'moreOptions') {
      usedWidth = collapseLastItemMatching(result, item, usedWidth);
    }
    if (usedWidth > barWidth && isCollapsable(item)) {
      usedWidth = collapseLastItemMatching(result, item, usedWidth);
    }
  }
  return result;
};

const isMergeableObject = (val) => {
  const nonNullObject = val && typeof val === 'object';
  return (
    nonNullObject
    && Object.prototype.toString.call(val) !== '[object RegExp]'
    && Object.prototype.toString.call(val) !== '[object Date]'
  );
};

const emptyTarget = val => (Array.isArray(val) ? [] : {});

const cloneIfNecessary = (value, optionsArgument) => {
  const clone = optionsArgument && optionsArgument.clone === true;
  return clone && isMergeableObject(value)
    ? DeepMerge(emptyTarget(value), value, optionsArgument)
    : value;
};

const Utils = {};

/**
 * Searches for focusable elements inside domElement and gives focus to the first one
 * found. Focusable elements are assumed to be those with the data-focus-id attribute which is
 * used for various purposes in this project. If the excludeClass parameter is passed, elements
 * that have a matching class will be excluded from the search.
 * @function autoFocusFirstElement
 * @param {HTMLElement} domElement A DOM element that contains the element we want to focus.
 * @param {String} excludeClass A single className that we want the search query to filter out.
 */
Utils.autoFocusFirstElement = (domElement, excludeClass) => {
  if (!domElement || typeof domElement.querySelector !== 'function') {
    return;
  }
  let query = `[${CONSTANTS.KEYBD_FOCUS_ID_ATTR}]`;

  if (excludeClass) {
    query += `:not(.${excludeClass})`;
  }
  const firstFocusableElement = domElement.querySelector(query);

  if (firstFocusableElement && typeof firstFocusableElement.focus === 'function') {
    firstFocusableElement.focus();
  }
};

/**
 * Some browsers give focus to buttons after click, which leaves them highlighted.
 * This can be used to override the browsers' default behavior.
 *
 * @function blurOnMouseUp
 * @param {Event} event MouseUp event object.
 */
Utils.blurOnMouseUp = (event) => {
  if (event && event.currentTarget && typeof event.currentTarget.blur === 'function') {
    event.currentTarget.blur();
  }
};

/**
 * Converts a value to a number or returns null if it can't be converted or is not finite value.
 *
 * @function ensureNumber
 * @param {Object} value The value to convert.
 * @param {Number} defaultValue A default value to return when the input is not a valid number.
 * @returns {Number} The Number equivalent of value if it can be converted and is finite.
 * When value doesn't meet the criteria the function will return either defaultValue (if provided) or null.
 */
Utils.ensureNumber = (value, defaultValue) => {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return typeof defaultValue === 'undefined' ? null : defaultValue;
  }
  return number;
};

/**
 * Ensures that a number falls within a specified range. When a number is outside of
 * a range the function will return either the minimum or maximum allowed value depending on the case.
 *
 * @function constrainToRange
 * @param {Number} value The numerical value to constrain.
 * @param {Number} min The minimum value of the range.
 * @param {Number} max The maximum value of the range.
 * @returns {Number} The Number equivalent of value if it falls between min and max,
 * min if it falls below, max if it falls above.
 */
Utils.constrainToRange = (value, min, max) => {
  value = Utils.ensureNumber(value, 0); // eslint-disable-line
  min = Utils.ensureNumber(min, 0); // eslint-disable-line
  max = Utils.ensureNumber(max, 0); // eslint-disable-line
  return Math.min(Math.max(min, value), max);
};

/**
 * Same as Number.toFixed(), except that it returns a Number instead of a string.
 * @function toFixedNumber
 * @param {Object} value The numerical value to process.
 * @param {Number} digits The number of digits to appear after the decimal point.
 * @returns {Number} The equivalent of value with the specified precision. Will return 0 if value is not a valid number.
 */
Utils.toFixedNumber = (value, digits) => {
  let result = Utils.ensureNumber(value, 0);
  result = Utils.ensureNumber(result.toFixed(digits));
  return result;
};

/**
 * Returns the currentTime and totalTime values in HH:MM format that can be used for
 * a video time display UI or for ARIA labels.
 * Note that the meaning of these values changes depending on the type of video:
 * VOD
 *  currentTime: Formatted value of current playhead
 *  totalTime: Formatted value of video duration
 * Live - No DVR
 *  currentTime: Empty string
 *  totalTime: Empty string
 * Live - DVR - useNegativeDvrOffset === true
 *  currentTime: Formatted value of the negative offset from the live playhead. Empty string if playhead is at the Live position
 *  totalTime: Empty string
 * Live - DVR - useNegativeDvrOffset === false
 *  currentTime: Formatted value of the current playhead relative to max time shift
 *  totalTime: Formatted value of the total duration of the DVR window
 * NOTE:
 * Either property can be returned as an empty string if the parameters don't match the requirements.
 *
 * @function getTimeDisplayValues
 * @param {Number} currentPlayhead The current value of the playhead in seconds.
 * @param {Number} duration The total duration of the video in seconds. Should be -0 or Infinity for Live videos with no DVR.
 * @param {Boolean} isLiveStream Indicates whether the video is a livestream or not.
 * @param {Number} useNegativeDvrOffset Whether to display DVR progress as a negative offset value or not.
 * @returns {Object} An object with currentTime and totalTime properties in HH:MM format. Either of these
 * might be an empty string depending on the conditions above.
 */
Utils.getTimeDisplayValues = (currentPlayhead, duration, isLiveStream, useNegativeDvrOffset) => {
  currentPlayhead = Utils.ensureNumber(currentPlayhead); // eslint-disable-line
  duration = Utils.ensureNumber(duration, 0); // eslint-disable-line

  let currentTime = '';
  let totalTime = '';

  const currentPlayheadInt = parseInt(currentPlayhead, 10);
  const currentPlayheadTime = Number.isFinite(currentPlayheadInt)
    ? Utils.formatSeconds(currentPlayheadInt)
    : null;
  const timeShift = (currentPlayhead || 0) - duration;

  if (duration) {
    totalTime = Utils.formatSeconds(duration);
  }

  if (isLiveStream) {
    // Checking timeShift < 1 second (not === 0) as processing of the click after we
    // rewinded and then went live may take some time.
    const isLiveNow = Math.abs(timeShift) < 1;

    if (useNegativeDvrOffset) {
      // We don't show current time unless there is a time shift when using
      // negative DVR offset
      currentTime = isLiveNow ? '' : Utils.formatSeconds(timeShift);
    } else {
      // When not using negative DVR offset, DVR progress is shown in the usual
      // "current time of total time" format, with total time set to the size of DVR window
      currentTime = isLiveNow ? totalTime : Utils.formatSeconds(Math.ceil(duration + timeShift));
    }
  } else {
    currentTime = currentPlayheadTime;
  }
  // Total time is not displayed when using negative DVR offset, only the
  // timeshift is shown
  if (useNegativeDvrOffset) {
    totalTime = isLiveStream ? '' : totalTime;
  }

  return {
    currentTime,
    totalTime,
  };
};

/**
 * Returns a standard object containing fields required for discovery event data.

  * @function getDiscoveryEventData
  * @param {Number} assetPosition The position of the discovery asset in the carousel
  * @param {Number} pageSize  The total number of discovery assets in the carousel shown
  * @param {String} uiTag UI tag of the element that generated the discovery event
  * @param {Object} asset Object containing the asset data, including embed code and context
  * @param {Object} customData Object containing custom data for the discovery event
  * @returns {Object} An object with the discovery event data.
  */
Utils.getDiscoveryEventData = (assetPosition, pageSize, uiTag, asset, customData) => {
  const assetData = {
    embed_code: asset.embed_code,
    idType: CONSTANTS.DISCOVERY.ID_TYPE,
    ooyalaDiscoveryContext: Utils.getDiscoveryContext(asset),
  };
  const eventData = {
    customData,
    asset: assetData,
    contentSource: CONSTANTS.DISCOVERY.SOURCE,
    assetPosition,
    pageSize,
    uiTag,
  };
  return eventData;
};

/**
* Gets the ooyalaDiscovery context for a discovery asset. If asset has bucket info instead of
* ooyalaDiscovery context, decode bucket info and convert to discovery context
*
* @function getDiscoveryContext
* @param {Object} discoveryAsset - The discovery asset data
* @returns {Object} This ooyala discovery context
*/
Utils.getDiscoveryContext = (discoveryAsset) => {
  if (discoveryAsset == null) { return {}; }

  // If a discovery context is already attached, no need to do any conversion
  if (discoveryAsset.ooyalaDiscoveryContext != null) {
    return discoveryAsset.ooyalaDiscoveryContext;
  }

  if (discoveryAsset.bucket_info == null) { return {}; }

  // Remove the first char that indicates the bucket number
  const bucketInfo = JSON.parse(discoveryAsset.bucket_info.substring(1));

  // Decode the Base64 data and parse as JSON
  const bucketDecode = JSON.parse(window.atob(bucketInfo.encoded));

  // Return the new context with converted bucket info
  return { version: '1', data: bucketDecode };
};

/*
  * Sorts the qualities provided by the BITRATE_INFO_AVAILABLE event in descending
  * order by bitrate and then by resolution.
  * @function sortQualitiesByBitrate
  * @param {Array} qualities The array of qualities in the format provided by the BITRATE_INFO_AVAILABLE event.
  * @returns {Array} A new array with the qualities sorted in descending order by bitrate and then resolution.
  */
Utils.sortQualitiesByBitrate = (qualitiesDirty) => {
  // Avoid modifying the array that was passed
  const qualities = Array.isArray(qualitiesDirty) ? qualitiesDirty.slice() : [];
  // Sort bitrates by resolution and then by bitrate in descending order
  qualities.sort(
    (currentVal, nextVal) => {
      const current = currentVal || {};
      const next = nextVal || {};
      const bitrateA = Utils.ensureNumber(current.bitrate, 0);
      const bitrateB = Utils.ensureNumber(next.bitrate, 0);
      const resolutionA = Utils.ensureNumber(current.width, 1) * Utils.ensureNumber(current.height, 1);
      const resolutionB = Utils.ensureNumber(next.width, 1) * Utils.ensureNumber(next.height, 1);
      // When both bitrates are equal the difference will be falsy (zero) and
      // the second condition (resolution) will be used instead
      return bitrateB - bitrateA || resolutionB - resolutionA;
    }
  );
  return qualities;
};

/**
 * Gets the values of skip forward/back times configured in skin.json. The values
 * from the skin config are processed in order to ensure valid values: Numbers are
 * converted to integers and constrained to allowed minimum and maximums. Falls
 * back to default values when none are specified.
 * @function getSkipTimes
 * @param {Object} skinConfig - configuration for skin
 * @returns {Object} An object with two properties, 'forward' and 'backward',
 * which represent the amount of seconds to skip in each respective direction.
 */
Utils.getSkipTimes = (skinConfig) => {
  const skipTimes = {};
  skipTimes.backward = Utils.getPropertyValue(
    skinConfig,
    'skipControls.skipBackwardTime'
  );
  skipTimes.forward = Utils.getPropertyValue(
    skinConfig,
    'skipControls.skipForwardTime'
  );
  // Use default values if not valid numbers
  skipTimes.backward = Utils.ensureNumber(
    skipTimes.backward,
    CONSTANTS.UI.DEFAULT_SKIP_BACKWARD_TIME
  );
  skipTimes.forward = Utils.ensureNumber(
    skipTimes.forward,
    CONSTANTS.UI.DEFAULT_SKIP_FORWARD_TIME
  );
  // Ensure integer value and constrain to allowed min/max
  skipTimes.backward = Utils.constrainToRange(
    Math.floor(skipTimes.backward),
    CONSTANTS.UI.MIN_SKIP_TIME,
    CONSTANTS.UI.MAX_SKIP_TIME
  );
  skipTimes.forward = Utils.constrainToRange(
    Math.floor(skipTimes.forward),
    CONSTANTS.UI.MIN_SKIP_TIME,
    CONSTANTS.UI.MAX_SKIP_TIME
  );
  return skipTimes;
};

/**
 * Ensures that the given value is a valid playback speed by doing the following:
 * - Defaulting to 1 for unparseable values
 * - Constraining to max and min allowed playback speeds (done by default, but can be disabled)
 * - Truncating to at most two decimals
 * @private
 * @param {*} playbackSpeed The playback speed value that we want to sanitize
 * @param {Boolean} ignoreMinMax Will not constrain to minimum and maximum values when true
 * @returns {Number} A number which is the sanitized version of the value provided
 */
Utils.sanitizePlaybackSpeed = (playbackSpeed, ignoreMinMax) => {
  let sanitizedSpeed = Utils.ensureNumber(
    playbackSpeed,
    CONSTANTS.PLAYBACK_SPEED.DEFAULT_VALUE
  );
  if (!ignoreMinMax) {
    // TODO:
    // Read values from OO.CONSTANTS once these are available in html5-common
    sanitizedSpeed = Utils.constrainToRange(
      sanitizedSpeed,
      CONSTANTS.PLAYBACK_SPEED.MIN,
      CONSTANTS.PLAYBACK_SPEED.MAX
    );
  }
  sanitizedSpeed = Utils.toFixedNumber(sanitizedSpeed, 2);
  return sanitizedSpeed;
};

/**
 * Removes duplicate values from an array.
 * @private
 * @param {Array} array The array that we want to dedupe
 * @returns {Array} A new array that contains only the unique values from the array parameter
 */
Utils.dedupeArray = (array) => {
  if (!Array.isArray(array)) {
    return [];
  }
  const result = array.filter((element, index, arr) => arr.indexOf(element) === index);
  return result;
};

/**
 * Determines whether a mouse cursor represented by its clientX and clientY
 * properties is inside a DOM element contained within the given DOMRect.
 * @function isMouseInsideRect
 * @param {Object} mousePosition An object with the clientX and clientY coordinates of the mouse pointer.
 * @param {DOMRect} clientRect DOMRect returned by an element's getBoundingClientRect() function
 * @returns {Boolean} True if the mouse is inside the element, false otherwise
 */
Utils.isMouseInsideRect = (mousePosition, clientRect) => {
  if (!mousePosition || !clientRect) {
    return false;
  }
  if (
    mousePosition.clientX >= clientRect.left
    && mousePosition.clientX <= clientRect.right
    && mousePosition.clientY >= clientRect.top
    && mousePosition.clientY <= clientRect.bottom
  ) {
    return true;
  }
  return false;
};

/**
 * Returns a number that represents the current moment in time. Falls back to
 * Date.now() in platforms that don't support window.performance, which means that
 * the value could be relative to either the Unix epoch or the page load. For
 * this reason, values returned by this function should only be used for calculating
 * elapsed times.
 * @function getCurrentTimestamp
 * @returns {Number} A value in milliseconds that will be either performance.now() or
 * Date.now, depending on whether or not window.performance is available.
 */
Utils.getCurrentTimestamp = () => {
  if (window.performance
    && typeof window.performance.now === 'function') {
    return window.performance.now();
  }
  return Date.now();
};

/**
 * Trims the given text to fit inside of the given element, truncating with ellipsis.
 *
 * @function truncateTextToWidth
 * @param {DOMElement} element - The DOM Element to fit text inside
 * @param {String} text - The string to trim
 * @returns {String} String truncated to fit the width of the element
 */
Utils.truncateTextToWidth = (element, text) => {
  const testText = document.createElement('span');
  testText.style.visibility = 'hidden';
  testText.style.position = 'absolute';
  testText.style.top = '0';
  testText.style.left = '0';
  testText.style.whiteSpace = 'nowrap';
  testText.innerHTML = text;
  element.appendChild(testText);
  const actualWidth = element.clientWidth || element.getBoundingClientRect().width;
  const textWidth = testText.scrollWidth;
  let truncatedText = '';
  if (textWidth > actualWidth * 1.8) { // eslint-disable-line
    const truncPercent = actualWidth / textWidth;
    const newWidth = Math.floor(truncPercent * text.length) * 1.8 - 3; // eslint-disable-line
    truncatedText = `${text.slice(0, newWidth)}...`;
  } else {
    truncatedText = text;
  }
  element.removeChild(testText);
  return truncatedText;
};

/**
 * Returns a shallow clone of the object given
 *
 * @function clone
 * @param {Object} object - Object to be cloned
 * @returns {Object} Clone of the given object
 */

Utils.clone = (object) => {
  const clonedObj = {};
  for (const key in object) { // eslint-disable-line
    if (object.hasOwnProperty(key)) { // eslint-disable-line
      clonedObj[key] = object[key];
    }
  }
  return clonedObj;
};

/**
 * Clones the given object and merges in the keys and values of the second object.
 * Attributes in the cloned original will be overwritten.
 *
 * @function extend
 * @param {Object} original - Object to be extended
 * @param {Object} toMerge - Object with properties to be merged in
 * @returns {Object} Cloned and merged object
 */

Utils.extend = (original, toMerge) => {
  const extendedObject = Utils.clone(original);
  for (const key in toMerge) { // eslint-disable-line
    if (toMerge.hasOwnProperty(key)) { // eslint-disable-line
      extendedObject[key] = toMerge[key];
    }
  }
  return extendedObject;
};

/**
 * Convert raw seconds into human friendly HH:MM format
 *
 * @function formatSeconds
 * @param {integer} time The time to format in seconds
 * @returns {String} The time as a string in the HH:MM format
 */
Utils.formatSeconds = (time) => {
  const timeInSeconds = Math.abs(time);
  const secInMinute = 60;
  const secInHour = 3600;

  let seconds = parseInt(timeInSeconds, 10) % secInMinute;
  let hours = parseInt(timeInSeconds / secInHour, 10);
  let minutes = parseInt((timeInSeconds - hours * secInHour) / secInMinute, 10);

  if (hours < 10) {
    hours = `0${hours}`;
  }

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  const timeStr = parseInt(hours, 10) > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
  if (time >= 0) {
    return timeStr;
  }
  return `-${timeStr}`;
};

/**
 * Check if the current browser is Safari
 *
 * @function isSafari
 * @returns {Boolean} Whether the browser is Safari or not
 */
Utils.isSafari = () => !!window.navigator.userAgent.match(/AppleWebKit/) && !window.navigator.userAgent.match(/Chrome/);

/**
 * Check if the current browser is Chrome
 *
 * @function isChrome
 * @returns {Boolean} Whether the browser is Chrome or not
 */
Utils.isChrome = () => !!window.navigator.userAgent.match(/Chrome/) && !!window.navigator.vendor.match(/Google Inc/);

/**
 * Check if the current browser is Edge
 *
 * @function isEdge
 * @returns {Boolean} Whether the browser is Edge or not
 */
Utils.isEdge = () => !!window.navigator.userAgent.match(/Edge/);

/**
 * Check if the current browser is Internet Explorer
 *
 * @function isIE
 * @returns {Boolean} Whether the browser is IE or not
 */
Utils.isIE = () => !!window.navigator.userAgent.match(/MSIE/) || !!window.navigator.userAgent.match(/Trident/);

/**
 * Check if the current device is Android
 *
 * @function isAndroid
 * @returns {Boolean} Whether the browser is running on Android or not
 */
Utils.isAndroid = () => !!window.navigator.appVersion.match(/Android/);

/**
 * Check if the current device is iOS
 *
 * @function isIos
 * @returns {Boolean} Whether the device is iOS or not
 */
Utils.isIos = () => !!(window.navigator.platform.match(/(iPhone|iPad|iPod)/));

/**
 * Check if the current device is an iPhone
 *
 * @function isIPhone
 * @returns {Boolean} Whether the device is an iPhone or not
 */
Utils.isIPhone = () => !!(window.navigator.platform.match(/(iPhone|iPod)/));

/**
 * Check if the current device is a mobile device
 *
 * @function isMobile
 * @returns {Boolean} Whether the browser device a mobile device or not
 */
Utils.isMobile = () => Utils.isAndroid() || Utils.isIos();

/**
 * Get type of user device.
 *
 * @returns {string} - name of the user device, may be one of the values 'desktop', 'phone' or 'tablet'.
 */
Utils.getUserDevice = () => {
  let device = 'desktop';
  const { userAgent } = window.navigator;
  if (userAgent) {
    const lowerUserAgent = userAgent.toLowerCase();
    if (/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard)/
      .test(lowerUserAgent)) {
      device = 'phone';
    } else if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/
      .test(lowerUserAgent)) {
      device = 'tablet';
    }
  }
  return device;
};

/**
 * Check if the current browser is Internet Explorer 10
 *
 * @function isIE10
 * @returns {Boolean} Whether the browser is IE10 or not
 */
Utils.isIE10 = () => !!window.navigator.userAgent.match(/MSIE 10/);

/**
 * Determine the best language to use for localization
 *
 * @function getLanguageToUse
 * @param {Object} skinConfig - The skin configuration file to read languages from
 * @param {Object} playerParam - Page-level params
 * @returns {String} The ISO code of the language to use
 */
Utils.getLanguageToUse = (skinConfig, playerParam) => {
  if (!skinConfig) {
    return '';
  }

  const { localization } = skinConfig;
  let userBrowserLanguage;
  let isLanguageCodeInAvailablelLanguageFile = false;

  const isUseBrowserLanguage = playerParam && playerParam['useBrowserLanguage']; // eslint-disable-line

  // if useUserBrowserLanguage is set to true, use language from user browser settings
  if (isUseBrowserLanguage) {
    userBrowserLanguage = Utils.getUserBrowserLanguage();
    isLanguageCodeInAvailablelLanguageFile = !!localization &&
    Utils.isLanguageCodeInAvailablelLanguageFile(
      localization.availableLanguageFile, userBrowserLanguage
    );
  }

  if (!userBrowserLanguage || !localization || !isLanguageCodeInAvailablelLanguageFile) {
    // if useUserBrowserLanguage is not set to true or
    // useUserBrowserLanguage is set to true but browser language is not checkable or
    // there is no browser language in availableLanguageFile
    return Utils.getDefaultLanguage(localization);
  }
  return userBrowserLanguage;
};

/**
 * @param {Object} localization - location configuration object
 * @param {String} localization.defaultLanguage - value for default language
 * @returns {String} defaultLanguage - language code from file "skin.json" (
 * before executing function "onSkinMetaDataFetched") or language code that was set
 * in the page-level parameters (after executing function "onSkinMetaDataFetched")
 */
Utils.getDefaultLanguage = (localization) => {
  const defaultLanguage = !!localization && localization.defaultLanguage;
  return defaultLanguage || '';
};

/**
 *
 * @returns {String} two-digit value of an user's system language or an empty string
 */
Utils.getUserBrowserLanguage = () => {
  // Examples of valid language codes are: "en", "en-US", "de", "fr", etc.
  const { navigator } = window;
  let language;
  if (navigator) {
    language = (
      navigator.language
      // "language" property returns the language of the browser application in
      // Firefox, Opera, Google Chrome and Safari
      || navigator.userLanguage
      // "userLanguage" property returns the current Regional and Language settings
      // of the operating system in
      // Internet Explorer and the language of the browser application in Opera
      || navigator.systemLanguage
      // "systemLanguage" property returns the language edition of the operating system in
      // Internet Explorer
    );
  }
  return language ? language.substr(0, 2).toLowerCase() : ''; // remove lang sub-code
};

/**
 *
 * @param {Array} availableLanguageList - array of objects of language code values
 * with the key "language"
 * @param {string} languageCode - two-digit value of the language
 * @returns {Boolean} "true" if the corresponding language code "languageCode" is
 * in the array of available languages "availableLanguageList",
 * otherwise "false"
 */
Utils.isLanguageCodeInAvailablelLanguageFile = (availableLanguageList, languageCode) => {
  if (!(availableLanguageList && Array.isArray(availableLanguageList) && languageCode)) {
    return false;
  }
  return availableLanguageList.some(languageObj => languageObj.language === languageCode);
};

/**
 * Get the localized string for a given localization key
 *
 * @function getLocalizedString
 * @param {String} language - ISO code of the language to use
 * @param {String} stringId - The key of the localized string to retrieve
 * @param {Object} localizedStrings - Mapping of string keys to localized values
 * @returns {String} The localizted string
 */
Utils.getLocalizedString = (language, stringId, localizedStrings) => {
  try {
    return localizedStrings[language][stringId] || stringId;
  } catch (error) {
    return stringId;
  }
};

/**
 * Get the countdown string that shows the time until a given future timestamp
 *
 * @function getStartCountdown
 * @param {Number} countdownTimestampDirty - The Unix timestamp for the asset flight time start
 * @returns {String} The countdown time string
 */
Utils.getStartCountdown = (countdownTimestampDirty) => {
  let dayString = 'day';
  let hourString = 'hour';
  let minuteString = 'minute';
  const hoursInDay = 24;
  const mSecInHour = 3600000;
  const mSecInMinute = 60000;
  let countdownTimestamp = countdownTimestampDirty;
  try {
    if (countdownTimestamp < 0) {
      return '';
    }
    const days = Math.floor(countdownTimestamp / (hoursInDay * mSecInHour));
    if (days !== 1) {
      dayString += 's';
    }
    countdownTimestamp -= days * hoursInDay * mSecInHour;
    const hours = Math.floor(countdownTimestamp / mSecInHour);
    if (hours !== 1) {
      hourString += 's';
    }
    countdownTimestamp -= hours * mSecInHour;
    const minutes = Math.floor(countdownTimestamp / mSecInMinute);
    if (minutes !== 1) {
      minuteString += 's';
    }
    return `${days} ${dayString}, ${hours} ${hourString}, and ${minutes} ${minuteString}`;
  } catch (error) {
    return '';
  }
};

/**
 * Safely gets the value of an object's nested property.
 *
 * @function getPropertyValue
 * @param {Object} object - The object we want to extract the property form
 * @param {String} propertyPath - A path that points to a nested property in the object with a form like 'prop.nestedProp1.nestedProp2'
 * @param {Object} defaultValue - (Optional) A default value to return when the property is undefined
 * @returns {Object|String|Number} - The value of the nested property, the default value if nested property is undefined. If the value is null, null will be returned.
 */
Utils.getPropertyValue = (object, propertyPath, defaultValue) => {
  let value = null;
  let currentObject = object;
  let currentProp = null;

  try {
    const props = propertyPath.split('.');

    for (let index = 0; index < props.length; index += 1) {
      currentProp = props[index];
      currentObject = value = currentObject[currentProp]; // eslint-disable-line
    }

    if (typeof value === 'undefined') {
      return defaultValue;
    }
    return value;
  } catch (err) {
    return defaultValue;
  }
};

/**
 * Converts string value to number (needed for backwards compatibility of skin.json parameters)
 *
 * @function convertStringToInt
 * @param {String} propertyDirty - string value
 * @returns {Number} - number
 */
Utils.convertStringToNumber = (propertyDirty) => {
  let property = propertyDirty;
  if (property.toString().indexOf('%') > -1) {
    property = parseInt(property, 0) / 100;
  }
  return Number.isFinite(Number(property)) ? Number(property) : 0;
};

/**
 * Determines whether an element contains a class or not.
 * TODO:
 * classList.contains is much better for this purpose, but our current version
 * of React Test Utils generates events with a null classList, which results in
 * broken unit tests.
 *
 * @param {DOMElement} element The DOM element which we want to check
 * @param {String} className The name of the class we want to match
 * @returns {Boolean} True if the element contains the given class, false otherwise
 */
Utils.elementHasClass = (element, className) => {
  if (!element) {
    return false;
  }
  return (` ${element.className} `).indexOf(` ${className} `) > -1;
};

/**
 * Returns the icon element associated with an event (usually mouseover or mouseout),
 * which can be either the event's target element itself or a child of the target element.
 * The icon is matched with a class name.
 * This is needed in order to circumvent a Firefox issue that prevents mouse events from
 * being triggered in elements that are children of buttons (such as icons).
 *
 * @param {String} domEvent The event whose icon element we want to extract
 * @param {String} iconClass The class that will be used to match the icon element
 * @returns {Object} The element that has been identified as the icon, or null if none was found
 */
Utils.getEventIconElement = (domEvent, iconClass) => {
  let iconElement = null;
  const classToMatch = iconClass || 'oo-icon';
  const currentTarget = domEvent ? domEvent.currentTarget : null;

  if (currentTarget) {
    // Check to see if the target itself is the icon, otherwise get
    // the first icon child
    if (Utils.elementHasClass(currentTarget, classToMatch)) {
      iconElement = currentTarget;
    } else {
      iconElement = currentTarget.querySelector(`.${classToMatch}`);
    }
  }
  return iconElement;
};

/**
 * Highlight the given element for hover effects
 *
 * @function Highlight
 * @param {DOMElement} target - The element to Highlight
 * @param {number} opacity - opacity of the element
 * @param {string} color - color of the element
 */
Utils.highlight = (target, opacity, color) => {
  target.style.opacity = opacity; // eslint-disable-line
  target.style.color = color; // eslint-disable-line
  // HEADSUP
  // This is currently the same style as the one used in _mixins.scss.
  // We should change both styles whenever we update Utils.
  target.style.textShadow = '0px 0px 3px rgba(255, 255, 255, 0.5), ' // eslint-disable-line
    + '0px 0px 6px rgba(255, 255, 255, 0.5), '
    + '0px 0px 9px rgba(255, 255, 255, 0.5)';
};

/**
 * Remove the highlight effect of the given element
 *
 * @function removeHighlight
 * @param {DOMElement} target - The element to remove the highlight effect from
 * @param {number} opacity - The opacity to return the element to
 * @param {string} color - The color to return the element to
 */
Utils.removeHighlight = (target, opacity, color) => {
  target.style.opacity = opacity; // eslint-disable-line
  target.style.color = color; // eslint-disable-line
  target.style.textShadow = ''; // eslint-disable-line
};

/**
 * Determine which buttons should be shown in the control bar given the width of the player<br/>
 * Note: items which do not meet the item spec will be removed and not appear in the results.
 *
 * @function collapse
 * @param {Number} barWidth - Width of the control bar
 * @param {Object[]} orderedItems - array of left to right ordered items. Each item meets the skin's "button" schema.
 * @param {number} responsiveUIMultiple -
 * @returns {Object} An object of the structure {fit:[], overflow:[]} where the fit object is
 *   an array of buttons that fit in the control bar and overflow are the ones that should be hidden
 */
Utils.collapse = (barWidth, orderedItems, responsiveUIMultiple) => {
  if (window.isNaN(barWidth) || barWidth === undefined) { // eslint-disable-line
    return orderedItems;
  }
  if (!orderedItems) {
    return [];
  }
  const validItems = orderedItems.filter(item => isValid(item));
  return collapse(barWidth, validItems, responsiveUIMultiple);
};

/**
 * Find thumbnail image URL and its index that correspond to given time value
 *
 * @function findThumbnail
 * @param {Object} thumbnails - metadata object containing information about thumbnails
 * @param {Number} hoverTime - time value to find thumbnail for
 * @param {Number} duration - duration of the video
 * @param {Boolean} isVideoVr - if video is vr
 * @returns {Object} object that contains URL and index of requested thumbnail
 */
Utils.findThumbnail = (thumbnails, hoverTime, duration, isVideoVr) => {
  const timeSlices = thumbnails.data.available_time_slices;
  let width = thumbnails.data.available_widths[0]; // choosing the lowest size
  if (isVideoVr && width < CONSTANTS.THUMBNAIL.MAX_VR_THUMBNAIL_BG_WIDTH) {
    // it is necessary to take bigger image for showing part of the image
    // so choose not the lowest size but bigger one, the best width is 380
    const index = thumbnails.data.available_widths.length - 1 >= CONSTANTS.THUMBNAIL.THUMBNAIL_VR_RATIO
      ? CONSTANTS.THUMBNAIL.THUMBNAIL_VR_RATIO
      : thumbnails.data.available_widths.length - 1;
    width = thumbnails.data.available_widths[index];
  }

  let position = Math.floor(hoverTime / duration * timeSlices.length);
  position = Math.min(position, timeSlices.length - 1);
  position = Math.max(position, 0);

  let selectedTimeSlice = null;
  let selectedPosition = position;

  if (timeSlices[position] >= hoverTime) {
    [selectedTimeSlice] = timeSlices;
    for (let index = position; index >= 0; index -= 1) {
      if (timeSlices[index] <= hoverTime) {
        selectedTimeSlice = timeSlices[index];
        selectedPosition = index;
        break;
      }
    }
  } else {
    selectedTimeSlice = timeSlices[timeSlices.length - 1];
    for (let index = position; index < timeSlices.length; index += 1) {
      if (timeSlices[index] === hoverTime) {
        selectedTimeSlice = timeSlices[index];
        selectedPosition = index;
        break;
      } else if (timeSlices[index] > hoverTime) {
        selectedTimeSlice = timeSlices[index - 1];
        selectedPosition = index - 1;
        break;
      }
    }
  }

  const selectedThumbnail = thumbnails.data.thumbnails[selectedTimeSlice][width].url;
  const imageWidth = thumbnails.data.thumbnails[selectedTimeSlice][width].width;
  const imageHeight = thumbnails.data.thumbnails[selectedTimeSlice][width].height;
  return {
    url: selectedThumbnail,
    pos: selectedPosition,
    imageWidth,
    imageHeight,
  };
};

/**
 * Check if the current browser is on a touch enabled device.
 * Function from https://hacks.mozilla.org/2013/04/detecting-touch-its-the-why-not-the-how/
 *
 * @function browserSupportsTouch
 * @returns {Boolean} Whether or not the browser supports touch events.
 */
Utils.browserSupportsTouch = () => 'ontouchstart' in window
  || window.navigator.maxTouchPoints > 0
  || window.navigator.msMaxTouchPoints > 0;

/**
 * Creates wrapper object with sanitized html. This marked data can subsequently be passed into dangerouslySetInnerHTML
 * See https://facebook.github.io/react/tips/dangerously-set-inner-html.html
 *
 * @function createMarkup
 * @param {String} html - html to be sanitized
 * @returns {Object} Wrapper object for sanitized markup.
 */
Utils.createMarkup = html => ({ __html: html });

/**
 * Deep merge arrays and array values
 *
 * @function arrayDeepMerge
 * @param {Array} target - An array that will receive new items if additional items are passed
 * @param {Array} source - An array containing additional items to merge into target
 * @param {Object} optionsArgument - parameters passed to parent DeepMerge function, i.e. -
 *        arrayMerge - https://github.com/KyleAMathews/deepmerge#arraymerge
 *        clone - https://github.com/KyleAMathews/deepmerge#clone
 *        arrayUnionBy - key used to compare Objects being merged, i.e. button name
 *        arrayFusion - method used to merge arrays ['replace', 'deepmerge']
 *        buttonArrayFusion - method used to merge button array ['replace', 'prepend', 'deepmerge']
 *        arraySwap - swaps target/source
 * @returns {Array} new merged array with items from both target and source
 */
Utils.arrayDeepMerge = (target, source, optionsArgument) => {
  if (source && source.length) {
    // if source is button and buttonArrayFusion is 'replace', return source w/o merge
    if (source[0][optionsArgument.arrayUnionBy] && optionsArgument.buttonArrayFusion === 'replace') {
      return source;
    }
    // if source is not button and arrayFusion is 'replace', return source w/o merge
    if (!source[0][optionsArgument.arrayUnionBy] && optionsArgument.arrayFusion !== 'deepmerge') {
      return source;
    }
  }

  const targetArray = optionsArgument.arraySwap ? source : target;
  const sourceArray = optionsArgument.arraySwap ? target : source;
  const uniqueSourceArray = sourceArray.slice(); // array used to keep track of objects that do not exist in target
  let destination = targetArray.slice();

  sourceArray.forEach((sourceItem, index) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = cloneIfNecessary(sourceItem, optionsArgument);
    } else if (isMergeableObject(sourceItem)) {
      // custom merge for buttons array, used to maintain source sort order
      if (sourceItem[optionsArgument.arrayUnionBy]) {
        targetArray.forEach((targetItem, subIndex) => {
          // gracefully merge buttons by name
          if (sourceItem[optionsArgument.arrayUnionBy] === targetItem[optionsArgument.arrayUnionBy]) {
            const targetObject = optionsArgument.arraySwap ? sourceItem : targetItem;
            const sourceObject = optionsArgument.arraySwap ? targetItem : sourceItem;
            destination[subIndex] = DeepMerge(targetObject, sourceObject, optionsArgument);

            // prunes uniqueSourceArray to unique items not in target
            if (
              optionsArgument.buttonArrayFusion === 'prepend'
              && uniqueSourceArray
              && uniqueSourceArray.length
            ) {
              for (const x in uniqueSourceArray) { // eslint-disable-line
                if (
                  uniqueSourceArray[x][optionsArgument.arrayUnionBy]
                  === sourceItem[optionsArgument.arrayUnionBy]
                ) {
                  uniqueSourceArray.splice(x, 1);
                  break;
                }
              }
            }
          }
        });
      } else {
        destination[index] = DeepMerge(targetArray[index], sourceItem, optionsArgument);
      }
    } else if (targetArray.indexOf(sourceItem) === -1) {
      destination.push(cloneIfNecessary(sourceItem, optionsArgument));
    }
  });
  // prepend uniqueSourceArray array of unique items to buttons after flexible space
  if (optionsArgument.buttonArrayFusion === 'prepend' && uniqueSourceArray && uniqueSourceArray.length) {
    let flexibleSpaceIndex = null;
    // find flexibleSpace btn index
    for (const y in destination) { // eslint-disable-line
      if (destination[y][optionsArgument.arrayUnionBy] === 'flexibleSpace') {
        flexibleSpaceIndex = parseInt(y);
        break;
      }
    }
    // loop through uniqueSourceArray array, add unique objects
    // to destination array after flexible space btn
    if (flexibleSpaceIndex) {
      flexibleSpaceIndex += 1; // after flexible space
      for (const z in uniqueSourceArray) { // eslint-disable-line
        destination.splice(flexibleSpaceIndex, 0, uniqueSourceArray[z]);
      }
    } else {
      destination = destination.concat(uniqueSourceArray);
    }
  }
  return destination;
};

/**
 * Checks if string is valid
 *
 * @function isValidString
 * @param {String} src - string to be validated
 * @returns {Boolean} true if string is valid, false if not
 */
Utils.isValidString = src => src && (typeof src === 'string' || src instanceof String);

/**
 * Returns sanitized config data
 *
 * @function sanitizeConfigData
 * @param {Object} data to be sanitized
 * @returns {Object} data if data is valid, empty object if not
 */
Utils.sanitizeConfigData = (data) => {
  if (data && !Array.isArray(data)) {
    return data;
  }
  OO.log('Invalid player configuration json data: ', data);
  return {};
};

/**
 * Returns whether the OS can render the skin
 * @returns {[boolean]} true if the OS can render the skin.
 */
Utils.canRenderSkin = () => !(OO.isIphone && OO.iosMajorVersion < 10);

/**
 * @description - returns the correct coordinates of events depending on the platform
 * @param {Event} event - event
 * @returns {object} - coordinates x, y
 */
Utils.getCoords = (event) => {
  const coords = {};
  const isMobileTouhes = (OO.isIos || OO.isAndroid) && event.touches && !!event.touches.length;

  if (isMobileTouhes) {
    coords.x = event.touches[0].pageX; // eslint-disable-line
    coords.y = event.touches[0].pageY; // eslint-disable-line
  } else {
    coords.x = event.pageX; // eslint-disable-line
    coords.y = event.pageY; // eslint-disable-line
  }

  return coords;
};

/**
 * get mobile device orientation type
 * @returns {string} - one of the following:
 * "portrait-primary"
 * "portrait-secondary" (portrait upside down)
 * "landscape-primary"
 * "landscape-secondary" (landscape upside down)
 */
Utils.getOrientationType = () => {
  let orientationType = window.screen.orientation;
  if (orientationType && orientationType !== null && typeof orientationType === 'object') {
    orientationType = orientationType.type;
  } else {
    orientationType = window.screen.mozOrientation || window.screen.msOrientation;
  }
  return orientationType;
};

/**
 * if device orientation is portrait set "landscape-primary" orientation for the device
 * @returns {boolean} - true if "landscape-primary" orientation was set, returns false in otherwise
 */
Utils.setLandscapeScreenOrientation = () => {
  const orientationType = Utils.getOrientationType();
  if (
    orientationType
    && (orientationType === 'portrait-secondary' || orientationType === 'portrait-primary')
  ) {
    const landscapeOrientation = 'landscape-primary';
    const { screen } = window;
    if (screen.orientation && screen.orientation.lock) {
      // chrome browser
      screen.orientation.lock(landscapeOrientation);
    } else if (screen.lockOrientation) {
      // other
      screen.lockOrientation(landscapeOrientation);
    } else if (screen.mozLockOrientation) {
      // ff
      screen.mozLockOrientation(landscapeOrientation);
    } else if (screen.msLockOrientation) {
      // ie
      screen.msLockOrientation(landscapeOrientation);
    } else {
      return false;
    }
    return true;
  }
  return false;
};

/**
 * Gets the client width of an element. Retrieves clientWidth if it is exists, otherwise will
 * get the width from the getBoundingClientRect
 * getBoundingClientRect().width returns the unrounded clientWidth. However, jsdom won't allow us to set clientWidth,
 * but we can mock getBoundingClientRect
 * @param {Object} element The element to retrieve the client width
 * @returns {*|number} The client width of the element. Returns false if the element does not exist
 */
Utils.getClientWidth = element => element && (element.clientWidth || element.getBoundingClientRect().width);

/**
 * Gets the client height of an element. Retrieves clientWidth if it is exists, otherwise will
 * get the height from the getBoundingClientRect
 * getBoundingClientRect().height returns the unrounded clientHeight. However, jsdom won't allow us to set clientHeight,
 * but we can mock getBoundingClientRect.
 * @param {Object} element The element to retrieve the client height
 * @returns {*|number} The client height of the element. Returns false if the element does not exist
 */
Utils.getClientHeight = element => element
  && (element.clientHeight || element.getBoundingClientRect().height);

/**
 * Gets the icon, aria label, and button tooltip for the play icon based on the current player state.
 * @param {string} playerState The current player state
 * @returns {object} icon - the icon to display
 *                   ariaLabel - the aria label to display
 *                   buttonTooltip - the button tooltip to display
 */
Utils.getPlayButtonDetails = (playerState) => {
  let playIcon;
  let playPauseAriaLabel;
  let playBtnTooltip;
  if (playerState === CONSTANTS.STATE.PLAYING) {
    playIcon = 'pause';
    playPauseAriaLabel = CONSTANTS.ARIA_LABELS.PAUSE;
    playBtnTooltip = CONSTANTS.SKIN_TEXT.PAUSE;
  } else if (playerState === CONSTANTS.STATE.END) {
    playIcon = 'replay';
    playPauseAriaLabel = CONSTANTS.ARIA_LABELS.REPLAY;
    playBtnTooltip = CONSTANTS.SKIN_TEXT.REPLAY;
  } else {
    playIcon = 'play';
    playPauseAriaLabel = CONSTANTS.ARIA_LABELS.PLAY;
    playBtnTooltip = CONSTANTS.SKIN_TEXT.PLAY;
  }
  return {
    icon: playIcon,
    ariaLabel: playPauseAriaLabel,
    buttonTooltip: playBtnTooltip,
  };
};

module.exports = Utils;
