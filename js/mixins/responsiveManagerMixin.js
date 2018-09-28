import ReactDOM from 'react-dom';
import ClassNames from 'classnames';
import debounce from 'lodash.debounce';
import Utils from '../components/utils';

const ResponsiveManagerMixin = {
  getInitialState: function() {
    return {
      componentWidth: null,
      componentHeight: null,
      responsiveClass: null,
      responsiveId: null
    };
  },

  componentDidMount: function() {
    window.addEventListener('resize', debounce(this.onResize, 150));
    window.addEventListener('webkitfullscreenchange', debounce(this.onResize, 150));
    this.generateResponsiveData();
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('webkitfullscreenchange', this.onResize);
  },

  onResize: function() {
    this.generateResponsiveData();
  },

  /**
   * It gives the value of height, based on the width of mainVideoContainer (in a ratio 16:9);
   * @param {number} componentWidth - width of the element
   * @returns {number} - default height of the element
   * If we do not have width of mainVideoContainer it returns 0
   */
  getDefaultElementHeight: function(componentWidth) {
    const ratioCoef = 0.5625; // y - coefficient for default aspect ratio 16:9
    let componentHeight = 0;
    if (componentWidth && Utils.ensureNumber(componentWidth)) {
      componentHeight = componentWidth * ratioCoef;
    }
    return componentHeight;
  },

  generateResponsiveData: function() {
    let componentWidth = 0;
    let componentHeight = 0;
    const dom = ReactDOM.findDOMNode(this);
    if (dom) {
      componentWidth = Math.ceil(dom.getBoundingClientRect().width);
      componentHeight = dom.parentNode ? dom.parentNode.getBoundingClientRect().height : componentHeight;
      if (!componentHeight) {
        let width = componentWidth;
        // If width === 0, we can use width of mainVideoContainer
        if (!width && !!this.props.controller.state.mainVideoContainer) {
          width = this.props.controller.state.mainVideoContainer.width();
        }
        // Height must exist, if height is 0 or do not exist, we should use default value for height
        componentHeight = this.getDefaultElementHeight(width);
      }
    }
    const breakpoints = this.props.skinConfig.responsive.breakpoints;
    let breakpointData = {
      classes: {},
      ids: {}
    };

    let key;
    if (this.props.controller.state.audioOnly) {
      key = 'audio-only-xs';
      breakpointData.classes[breakpoints[key].name] = true;
      breakpointData.ids[breakpoints[key].id] = true;
    } else {
      // loop through breakpoints from skinConfig
      // generate Classname object with name and min/max width
      for (key in breakpoints) {
        if (breakpoints.hasOwnProperty(key)) {
          // min width only, 1st breakpoint
          if (breakpoints[key].minWidth && !breakpoints[key].maxWidth) {
            breakpointData.classes[breakpoints[key].name] = breakpointData.ids[breakpoints[key].id] =
              componentWidth >= breakpoints[key].minWidth;
          }
          // min and max, middle breakpoints
          else if (breakpoints[key].minWidth && breakpoints[key].maxWidth) {
            breakpointData.classes[breakpoints[key].name] = breakpointData.ids[breakpoints[key].id] =
              componentWidth >= breakpoints[key].minWidth && componentWidth <= breakpoints[key].maxWidth;
          }
          // max width only, last breakpoint
          else if (breakpoints[key].maxWidth && !breakpoints[key].minWidth) {
            breakpointData.classes[breakpoints[key].name] = breakpointData.ids[breakpoints[key].id] =
              componentWidth <= breakpoints[key].maxWidth;
          }
        }
      }
    }

    // set responsive data to state
    this.setState({
      componentWidth: componentWidth,
      componentHeight: componentHeight,
      responsiveClass: ClassNames(breakpointData.classes),
      responsiveId: ClassNames(breakpointData.ids)
    });
  }
};
module.exports = ResponsiveManagerMixin;
