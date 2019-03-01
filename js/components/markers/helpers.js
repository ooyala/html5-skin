const MAXSIZE = 2;

/**
 * getPosition return the position in pixels for the markers
 *
 * @param {*} duration duration in seconds of the asset
 * @param {*} width size in pixels of the scrubber bar
 * @param {*} init starting second for the marker
 * @returns {number} position in pixels
 */
function getPosition(duration, width, init) {
  if (!duration || !width) {
    return 0;
  }
  return parseFloat(init) / parseFloat(duration) * width;
}

/**
 * getSize returns the size of the marker in pixels. This size represents the
 * amount of space to be filled in the scrubber bar
 *
 * @param {*} duration duration of the asset in seconds
 * @param {*} width size of the scrubber bar in pixels
 * @param {*} init starting point of the marker
 * @param {*} end final second of the marker
 * @returns {number} size of the marker
 */
function getSize(duration, width, init, end) {
  let size = MAXSIZE;
  if (!duration || !width) {
    return 0;
  }

  if (end && end > 0) {
    size = end - init;
  }

  return parseFloat(size) * parseFloat(width) / parseFloat(duration);
}

export { getPosition, getSize };
