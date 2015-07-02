var startScreenStyle = {
  style: {
    width: "100%",
    height: "100%",
    position: "absolute",
    overflow: "hidden",
  },
  posterStyle: {
    height: "100%",
    width: "100%",
    position: "absolute",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center"
  },
  infoPanel: {
    style: {
      position: "absolute",
      width: "100%"
    },
    title: {
      style: {
        fontSize: "32px",
        fontWeight: "bold",
        maxWidth: "70%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        color: "inherit"
      }
    },
    description: {
      style: {
        fontSize: "24",
        maxWidth: "70%",
        overflow: "visible",
        color: "inherit"
      }
    }
  },
  playButton: {
    icon: "glyphicon glyphicon-play",
    style: {
      fontSize: "72",
      transform: "translate(-50%, -50%)",
      position: "absolute",
      opacity: 1,
      transition: "opacity .25s ease-in-out"
    }
  }
};

var pauseScreenStyle = {
  style: {
    width: "100%",
    height: "100%",
    position: "absolute",
    overflow: "hidden",
  },
  infoPanel: {
    style: {
      position: "absolute",
      width: "100%"
    },
    title: {
      style: {
        fontSize: "32px",
        fontWeight: "bold",
        maxWidth: "70%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        color: "inherit"
      }
    },
    description: {
      style: {
        fontSize: "24",
        maxWidth: "70%",
        overflow: "visible",
        color: "inherit"
      }
    }
  },
  pauseIcon: {
    icon: "glyphicon glyphicon-pause",
    style: {
      fontSize: "24",
      transform: "translate(-50%, -50%)",
      position: "absolute",
      opacity: 1,
      transition: "font 2s, opacity 2s"
    }
  },
  fading: {
    width: "100%",
    height: "100%",
    position: "absolute",
    overflow: "hidden",
    backgroundColor: "black",
    opacity: "0",
    transition: "opacity 2s"
  }
};

var endScreenStyle = {
  style: {
    width: "100%",
    height: "100%",
    position: "absolute",
    overflow: "hidden"
  },
  posterStyle: {
    height: "100%",
    width: "100%",
    position: "absolute",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center"
  },
  infoPanel: {
    style: {
      position: "absolute",
      top: "5%",
      left: "5%",
      width: "100%"
    },
    title: {
      style: {
        fontSize: "32px",
        fontWeight: "bold",
        maxWidth: "70%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        color: "inherit"
      }
    },
    description: {
      style: {
        fontSize: "24",
        maxWidth: "70%",
        overflow: "visible",
        color: "inherit"
      }
    }
  },
  repeatButton: {
    icon: "glyphicon glyphicon-repeat",
    style: {
      top: "50%",
      left: "50%",
      fontSize: "18",
      transform: "translate(-50%, -50%)",
      position: "absolute",
      opacity: 1,
      transition: "opacity .25s ease-in-out"
    }
  }
};

var controlBarStyle = {
  controlBarSetting: {
    "background": "rgba(48, 48, 48, 0.8)",
    "width": "100%",
    "top": "100%",
    "position": "absolute",
    "padding": 0,
    "margin": 0,
    "listStyle": "none",
    "display": "flex",
    "flexFlow": "row nowrap",
    "justifyContent": "flex-start",
    "-webkit-user-select": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "user-select": "none",
    "transition": "transform 0.5s"
  },

  controlBarItemSetting: {
    "height": "100%",
    "color": "rgba(255, 255, 255, 0.6)",
    "fontWeight": "bold",
    "fontSize": "18",
    "textAlign": "center",
    "paddingLeft": "8px",
    "paddingRight": "8px"
  },

  durationIndicatorSetting: {
    "height": "100%",
    "color": "#ffffff",
    "opacity": 1,
    "fontSize": 14,
    "textAlign": "left",
    "flex": 1
  },

  iconSetting: {
  },

  volumeBarStyle: {
    "display": "inline-block",
    "height": "12px",
    "width": "4px",
    "paddingRight": "2px",
    "backgroundClip": "content-box",
    "position": "relative",
    "top": "-1px"
  }
};

var scrubberBarStyle = {
  scrubberBarSetting: {
    "background": "#afafaf",
    "width": "100%",
    "height": "6px",
    "padding": 0,
    "margin": 0,
    "-webkit-user-select": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "user-select": "none",
    "position": "absolute",
    "transition": "bottom 0.5s, height 0.25s"
  },

  bufferedIndicatorStyle: {
    "background": "#7f7f7f",
    "height": "100%",
    "position": "absolute"
  },

  playedIndicatorStyle: {
    "background": "#4389ff",
    "height": "100%",
    "position": "absolute"
  },

  playheadStyle: {
    "background": "#ffffff",
    "width": "10px",
    "height": "10px",
    "border": "solid white 1px",
    "borderRadius": "10px",
    "position": "absolute",
    "zIndex": 1,
    "top": "50%",
    "transform": "translateY(-50%)",
    "transition": "opacity 0.25s"
  }
};


var discoveryScreenStyle = {

  panelStyle: {
    position: "absolute",
    top: "50%",
    bottom: "32px",
    backgroundColor: "#444444",
    left: 0,
    right: 0,
    display: "flex",
    flexDirection: "row"
  },

  promoStyle: {
    visibility: "hidden",
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center"
  },

  panelTitleBarStyle: {
    position: "absolute",
    backgroundColor: "#444444",
    left: 0,
    right: 0,
    height: "20%",
    width: "100%",
    display: "inline-block"
  },


  panelTitleTextStyle: {
    position: "absolute",
    left: "25px",
    fontSize: "20",
    color: "white",
    margin: "1%"
  },

  discoveryToasterContainerStyle: {
    position: "absolute",
    backgroundColor: "#444444",
    top: "20%",
    height: "70%",
    width: "100%"
  },

  discoveryToasterStyle: {
    position: "absolute",
    backgroundColor: "#444444",
    top: "0",
    height: "90%",
    width: "2000px",
    right: 0,
    left: 25,
    display: "flex",
    flexDirection: "row",
    transition: "0.5s"
  },

  discoveryChevronLeftButtonContainer: {
    position: "absolute",
    backgroundColor: "transparent",
    height: "100%",
    width: "25px",
    color:"white",
    left: "0"
  },

  discoveryChevronRightButtonContainer: {
    position: "absolute",
    backgroundColor: "transparent",
    height: "100%",
    width: "25px",
    color:"white",
    right: "0"
  },

  discoveryChevronLeftButton: {
    icon: "glyphicon glyphicon-chevron-left",
    style: {
      top: "50%",
      left: "50%",
      fontSize: "18",
      transform: "translate(-50%, -50%)",
      position: "absolute",
      opacity: 1,
      transition: "opacity .25s ease-in-out"
    }
  },

  discoveryChevronRightButton: {
    icon: "glyphicon glyphicon-chevron-right",
    style: {
      top: "50%",
      left: "50%",
      fontSize: "18",
      transform: "translate(-50%, -50%)",
      position: "absolute",
      opacity: 1,
      transition: "opacity .25s ease-in-out"
    }
  },

  discoveryContentBlockStyle: {
    position: "relative",
    width: "100px",
    height: "95%",
    margin: "10px",
    backgroundColor: "#444444"
  },

  discoveryImageStyle: {
    position: "absolute",
    width: "100%",
    height: "75%"
  },

  discoveryContentTitleStyle: {
    position: "absolute",
    top: "75%",
    color: "white",
    fontSize: "10"
  }
};