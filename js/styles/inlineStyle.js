module.exports = {
  defaultScreenStyle: {
    style: {
      width: "100%",
      height: "100%",
      cursor: "default"
    },
    closeButtonStyle: {
      "opacity":"0.6",
      "color": "#ffffff"
    }
  },

  pauseScreenStyle: {
    videoBlur: {
      "-webkit-filter": "blur(3px)",
      "-moz-filter": "blur(3px)",
      "filter": "blur(3px)"
    },
    videoUnblur: {
      "-webkit-filter": "",
      "-moz-filter": "",
      "filter": ""
    }
  },

  controlBarStyle: {
    controlBarSetting: {
      "background": "rgba(0, 0, 0, 0.3)",
      "width": "100%",
      "bottom": "0%",
      "height": 60,
      "position": "absolute",
      "margin": 0,
      "fontSize": "18px",
      "listStyle": "none",
      "WebkitUserSelect": "none",
      "MozUserSelect": "none",
      "msUserSelect": "none",
      "userSelect": "none",
      "cursor": "default",
      "transition": "bottom 0.5s, height 0.25s",
      "zIndex": "12550"
    },

    controlBarItemsWrapper: {
      "display": "flex",
      "flexFlow": "row nowrap",
      "justifyContent": "flex-start",
      "paddingRight": "7.5px",
      "paddingLeft": "7.5px"
    },

    controlBarItemSetting: {
      "height": "100%",
      "fontWeight": "bold",
      "fontSize": "18px",
      "textAlign": "center",
      "paddingLeft": "7.5px",
      "paddingRight": "7.5px",
      "paddingTop": "0",
      "marginTop": "6px",
      "cursor": "pointer"
    },

    durationIndicatorSetting: {
      "height": "100%",
      "color": "#ffffff",
      "opacity": 1,
      "fontFamily": "'Roboto', sans-serif",
      "fontSize": 14,
      "paddingLeft": "7.5px",
      "paddingRight": "7.5px",
      "textAlign": "left",
      "marginTop": "6px",
      "cursor": "default"
    },

    iconSetting: {},
    volumeIconSetting: {
      "opacity": "1",
    },

    flexibleSpace: {
      "flex": "1",
      "WebkitFlex": "1"
    },

    liveItemStyle: {
    },

    liveCircleStyle: {
      "display": "inline-block",
      "width": "10px",
      "height": "10px",
      "borderRadius": "50%",
      "backgroundColor": "red",
      "marginRight": "2px"
    },

    liveTextStyle: {
      "fontSize": "10",
      "color": "LightGray"
    },

    volumeBarStyle: {
      "display": "inline-block",
      "backgroundClip": "content-box",
      "position": "relative",
      "width": "6px",
      "height": "18px",
      "paddingRight": "3px"
    },

    watermarkImageStyle: {
      "position": "relative",
      "height": "18px",
      "top": "14px"
    }
  },

  volumeSliderStyle: {
    volumeBarSetting: {
      "display": "inline-block",
      "backgroundClip": "content-box",
      "position": "relative",
      "background": "#afafaf",
      "width": "65px",
      "height": "5px",
      "WebkitTransform": "translateY(-120%)",
      "marginLeft": "5px",
      "borderRadius": "2px"
    },

    volumeIndicatorStyle: {
      "background": "#4389ff",
      "height": "100%",
      "width": "50%",
      "position": "absolute",
      "borderRadius": "2px"
    },

    volumeHeadPaddingStyle: {
      "width": "25px",
      "height": "25px",
      "position": "absolute",
      "zIndex": "1",
      "top": "50%",
      "WebkitTransform": "translateY(-50%) translateX(-50%)",
      "transform": "translateY(-50%) translateX(-50%)"
    },

    volumeHeadStyle: {
      "background": "#ffffff",
      "width": "8px",
      "height": "8px",
      "borderStyle": "solid",
      "borderColor": "white",
      "borderWidth": "1px",
      "borderRadius": "10px",
      "position": "absolute",
      "transition": "opacity 0.25s",
      "top": "50%",
      "cursor": "pointer",
      "left": "50%",
      "WebkitTransform": "translateY(-50%) translateX(-50%)",
      "transform": "translateY(-50%) translateX(-50%)"
    }
  },

  discoveryScreenStyle: {
    discoveryCountDownStyle: {
      width: "75px",
      height: "75px"
    }
  },

  adScreenStyle: {
    panelStyle: {
      "position": "absolute",
      "top": "0",
      "bottom": "32px",
      "width": "100%"
    },

    topBarStyle: {
      "position": "absolute",
      "top": "0%",
      "height": "34px",
      "width": "100%",
      "backgroundColor": "rgba(0, 0, 0, 0.5)",
      "margin": 0,
      "fontSize": "18px",
      "listStyle": "none",
      "display": "flex",
      "flexFlow": "row nowrap",
      "justifyContent": "flex-start",
      "WebkitUserSelect": "none",
      "MozUserSelect": "none",
      "msUserSelect": "none",
      "userSelect": "none",
      "transition": "bottom 0.5s, height 0.2 5s"
    },

    adPanelTopBarTextStyle: {
      "fontSize": "12pt",
      "color": "#ffffff",
      "fontFamily": "'Roboto', sans-serif",
      "margin": "auto",
      "textAlign": "center",
      "paddingLeft": "7.5px",
      "paddingRight": "7.5px",
      "white-space": "pre"
    },


    flexibleSpace: {
      "flex": 1,
      "WebkitFlex": 1
    },

    learnMoreButtonStyle: {
      "fontSize": "12pt",
      "fontFamily": "'Roboto Condensed', sans-serif",
      "color": "#ffffff",
      "margin": "auto",
      "textAlign": "center",
      "cursor": "pointer",
      "icon": {
        "fontSize": "13px",
        "marginRight": "5px"
      }
    },

    skipButtonStyle: {
      "fontSize": "12pt",
      "fontFamily": "'Roboto Condensed', sans-serif",
      "color": "#ffffff",
      "margin": "auto",
      "marginRight": "15px",
      "marginLeft": "30px",
      "textAlign": "center",
      "cursor": "pointer",
      "icon": {
        "fontSize": "13px",
        "marginRight": "5px"
      }
    }
  },

  adOverlayStyle: {
    style: {
      display: "inline-block",
      bottom: "50%",
      position: "absolute",
      transition: "bottom 0.5s, height 0.25s",
      margin: 0,
      padding: 0
    },

    overlayImageStyle: {
      display: "block"
    },

    closeButtonStyle: {
      display: "inline",
      position: "absolute",
      cursor: "pointer",
      height: "28px",
      width: "28px",
      top: "0px",
      right: "0px"
    },

    closeButtonIconStyle: {
      position: "absolute",
      fontSize: "8px",
      top: "50%",
      left: "50%",
      WebkitTransform: "translate(-50%, -50%)",
      msTransform: "translate(-50%, -50%)",
      transform: "translate(-50%, -50%)",
      color: "#ffffff",
      opacity: "0.6"
    }
  },

  MoreOptionsScreenStyle: {
    panelStyle: {
      "position": "absolute",
      "top": "0",
      "left": "0",
      "width": "100%",
      "height": "100%",
      "background": "rgba(0, 0, 0, 0.7)"
    },

    buttonListStyle: {
      "position": "absolute",
      "bottom": "0%",
      "left": "50%",
      "WebkitTransform": "translate(-50%, 50%)",
      "transform": "translate(-50%, 50%)",
      "height": "32",
      "opacity": "0",
      "listStyle": "none",
      "display": "flex",
      "flexFlow": "row nowrap",
      "justifyContent": "flex-start",
      "WebkitUserSelect": "none",
      "MozUserSelect": "none",
      "msUserSelect": "none",
      "userSelect": "none",
      "WebkitFlexDirection": "row",
      "flexDirection": "row",
      "transition": "bottom 0.7s, opacity 0.7s"
    },

    buttonStyle: {
      "height": "100%",
      "fontWeight": "bold",
      "fontSize": "30px",
      "textAlign": "center",
      "paddingLeft": "13px",
      "paddingRight": "13px",
      "margin": "0 auto",
      "opacity": "1",
      "cursor": "pointer"
    },

    iconStyle: {},

    closeButtonStyle: {
      "position": "absolute",
      "top": "35",
      "right": "35",
      "cursor": "pointer"
    }
  }
};