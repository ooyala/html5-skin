

const MAXSIZE = 2;
const getPosition = function(duration, width, init) {
  if (!duration || !width) {
    return 0;
  }
  return parseFloat(init) / parseFloat(duration) * width;
};

const getSize = function(duration, width, init, end) {
  let size = MAXSIZE;
  if (!duration || !width) {
    return 0;
  }    

  if (end && end > 0){
    size = end - init;
  }
  
  return parseFloat(size) * parseFloat(width) / parseFloat(duration);
};

export {getPosition, getSize}