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
    icon: "icon icon-play",
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
    icon: "icon icon-pause",
    style: {
      fontSize: "24",
      transform: "translate(-50%, -50%)",
      position: "absolute",
      opacity: 1,
      transition: "font 1s, opacity 1s"
    }
  },
  fading: {
    width: "100%",
    height: "100%",
    position: "absolute",
    overflow: "hidden",
    backgroundColor: "black",
    opacity: "0",
    transition: "opacity 1s"
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
    icon: "icon icon-upnext-replay",
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

  liveItemStyle: {
    position: "relative",
    width: "50",
    height: "50%",
    top: "30%",
    "border-radius": "3px"
  },

  liveCircleStyle: {
    position: "relative",
    width: "10px",
    height: "10px",
    "border-radius": "50%",
    top: "25%",
    left: "5%",
    backgroundColor: "red",
  },

  liveTextStyle: {
    position: "absolute",
    width: "60%",
    height: "80%",
    top: "10%",
    left: "40%",
    fontSize: "10",
    color: "LightGray"
  },

  volumeBarStyle: {
    "display": "inline-block",
    "height": "12px",
    "width": "4px",
    "paddingRight": "2px",
    "backgroundClip": "content-box",
    "position": "relative",
    "top": "-3px"
  },

  watermarkImageStyle: {
    position: "relative",
    height: "50%",
    top: "25%"
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
    "borderStyle": "solid",
    "borderColor": "white",
    "borderWidth": "1px",
    "borderRadius": "10px",
    "position": "absolute",
    "zIndex": 1,
    "top": "50%",
    "transform": "translateY(-50%)",
    "transition": "opacity 0.25s"
  }
};

var shareScreenStyle = {
  tabStyle: {
    display: "inline-block",
    width: "100px",
    height: "50px",
    lineHeight: "50px",
    borderRight: "1px solid #afafaf",
    textAlign: "center",
    backgroundColor: "#444444",
    color: "#afafaf",
    fontWeight: "bold"
  },

  lastTabStyle: {
    display: "inline-block",
    width: "100px",
    height: "50px",
    lineHeight: "50px",
    backgroundColor: "#444444",
    color: "#afafaf",
    fontWeight: "bold",
    borderRight: "0px none",
    flex: 1,
    textAlign: "left",
    paddingLeft: "25px"
  },

  activeTab: {
    color: "#4389ff",
    backgroundColor: "#3a3a3a"
  },

  socialIconStyle: {
    display: "inline-block",
    height: "30px",
    width: "30px",
    marginBottom: "15px",
    marginRight: "15px",
    backgroundColor: "aqua",
    textAlign: "center",
    fontSize: "22px",
    fontWeight: "bold",
    lineHeight: "30px",
    borderRadius: "6px"
  },

  panelStyle: {
    backgroundColor: "#3a3a3a",
    bottom: 0,
    flex: 1,
    color: "white",
    padding: "20px"
  },

  containerStyle: {
    position: "absolute",
    "top": 0,
    bottom: "32px",
    backgroundColor: "#444444",
    left: 0,
    right: 0,
    display: "flex",
    flexDirection: "column"
  },

  tabRowStyle: {
    borderBottom: "1px solid #afafaf",
    display: "flex",
    flexDirection: "row"
  },

  titleStyle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "15px"
  },

  embedUrlStyle: {
    color:"black",
    marginBottom: "15px",
    borderRadius: "6px",
    borderStyle: "none",
    width: "300px",
    height: "36px",
    paddingLeft: "15px"
  },

  emailSendButton: {
    backgroundColor:"#4389ff",
    border: "0px none transparent",
    borderRadius: "6px",
    height: "40px",
    width: "70px",
    marginTop: "8px"
  },

  emailInputField: {
    color:"gray",
    marginBottom: "15px",
    borderRadius: "6px",
    borderStyle: "none",
    width: "300px",
    height: "32px",
    paddingLeft: "15px"
  },

  emailTextArea: {
    color: "gray",
    height: "80px",
    width: "300px",
    borderRadius: "6px"
  },

  startAtInput: {
    color:"black",
    borderRadius: "6px",
    borderStyle: "none",
    width: "60px",
    height: "26px",
    paddingLeft: "10px"
  },

  embedTextArea: {
    height: "60%",
    width: "70%",
    color: "black",
    borderRadius: "6px"
  },

  closeButton: {
    position: "absolute",
    top:0,
    right: 0,
    height: "25px",
    width: "25px",
    backgroundColor: "#4389ff",
    color: "white",
    textAlign: "center",
    lineHeight: "25px"
  }
};

var discoveryScreenStyle = {

  panelStyle: {
    position: "absolute",
    bottom: "48px",
    backgroundColor: "rgba(0,0,0, 0.7)",
    left: 0,
    right: 0,
    flexDirection: "row",
    height: "255px"
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
    backgroundColor: "transparent",
    left: 0,
    right: 0,
    height: "20%",
    width: "100%",
    display: "inline-block"
  },


  panelTitleTextStyle: {
    position: "absolute",
    left: "25px",
    fontSize: "32",
    fontWeight: "bold",
    color: "white",
    margin: "1%",
    display: "inline-block",
    marginBottom: "35px",
    opacity: 1
  },

  discoveryToasterContainerStyle: {
    position: "absolute",
    backgroundColor: "transparent",
    top: "20%",
    height: "70%",
    width: "100%"
  },

  discoveryToasterStyle: {
    position: "absolute",
    top: "0",
    height: "90%",
    width: "100%",
    right: 0,
    left: 25,
    display: "flex",
    flexDirection: "row",
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
    icon: "icon icon-left",
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
    icon: "icon icon-right",
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
    marginLeft: "30px",
    marginRight: "30px",
    marginTop: "35px",
    height: "120px",
    width: "214px",
    "flex-shrink": 0
  },
  
  discoveryImageWrapperStyle: {
    position: "relative",
    height: "120px",
    width: "214px"
  },

  discoveryImageStyle: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },

  discoveryContentTitleStyle: {
    position: "relative",
    color: "white",
    fontSize: "22"
  },

  discoveryCountDownWrapperStyle: {
    position: "absolute",
    top: "37.5%",
    left: "50%",
    transform: "translate(-50%, -37.5%)"
  },

  discoveryCountDownStyle: {
    width: "38px",
    height: "38px"
  },

  discoveryCountDownIconStyle: {
    position: "absolute",
    top: "37.5%",
    left: "50%",
    transform: "translate(-50%, -37.5%)",
    "line-height":"32px",
    "z-index":10005,
    "color":"white"
  },

  closeButton: {
    position: "absolute",
    top:0,
    right: 0,
    height: "25px",
    width: "25px",
    backgroundColor: "#4389ff",
    color: "white",
    textAlign: "center",
    lineHeight: "25px"
  }
};

var closedCaptionScreenStyles ={

  screenStyle: {
    backgroundColor: "rgba(0,0,0,0.8)",
    height: "100%",
    width: "100%"
  },

  captionStyle: {
    display: "inline-block",
    height: "30",
    textAlign: "center",
    fontSize: "20",
    color: "#ffffff",
    marginLeft: "25",
    marginTop: "20",
    fontWeight: "bold"
  },

  switchStyle:{
    height: "24",
    textAlign: "left",
    fontSize: "10",
    color: "#FFFFFF",
    marginLeft: "25",
    marginTop: "20",
    marginBottom: "20",
    position: "relative"
  },

  switchContainer: {
    display: "inline-block",
    cursor: "pointer",
    width: "40",
    height: "24",
    position: "relative",
    marginLeft: "20",
    borderRadius: "100%",
  },
  switch: {
    display: "block",
    width: "100%",
    height: "75%",
    position: "absolute",
    left: "",
    right: "0",
    top: "12.5%",
    borderRadius: "20",
    onBackground: "#50AE54",
    transition: "all 0.5s ease-in-out"
  },
  switchThumb: {
    display: "block",
    width: "60%",
    height: "100%",
    position: "absolute",
    top: "0",
    left: "",
    right: "0",
    background: "#FFFFFF",
    borderRadius: "100%",
    transition: "all 0.1s ease-in 0s"
  },

  onStyle:{
    position: "absolute",
    top: "20%",
    left: "70",
    display:"inline-block",
    color: "grey"
  },

  offStyle:{
    position: "absolute",
    top: "20%",
    display:"inline-block",
    color: "grey"
  },

  itemStyle: {
    display: "inline-block",
    textAlign: "center",
    fontSize: "12",
    minWidth :"50",
    color: "#DDDDDD",
    marginLeft: "25",
    padding: "5",
    paddingLeft: "10",
    paddingRight: "10",
    transition: "all 0.0s ease"
  },

  itemSelectedStyle: {
    display: "inline-block",
    textAlign: "center",
    fontSize: "12",
    minWidth :"50",
    color: "white",
    marginLeft: "25",
    padding: "5",
    paddingLeft: "10",
    paddingRight: "10",
    //properties different from itemStyle
    backgroundColor: "#4389ff",
    borderRadius: "4"
  },

  CCPreviewPanelStyle:{
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.7)",
    position: "absolute",
    bottom: "20",
    transition: "all 1s ease",
    borderTop: "1px solid grey"
  },

  CCPreviewCaptionStyle: {
    color: "white",
    marginLeft: "20",
    marginTop: "20",
    fontSize: "10",
    paddingTop: "0",
    paddingBottom: "0"
  },

  CCPreviewTextStyle:{
    color: "white",
    marginLeft: "25",
    fontSize: "15",
    paddingTop: "5",
    paddingBottom: "0"
  },

  tableStyle:{
    width: "100%",
    height: "25%",
    paddingRight: "15"
  }
};

var upNextPanelStyle = {
  panelStyle: {
    position: "absolute",
    width: "100%",
    height: "25%",
    right: "0",
    bottom: "32px",
    backgroundColor: "black",
    "transition": "bottom 0.5s"
  },

  contentImageContainer: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "20%",
    height: "100%"
  },

  contentImage: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%"
  },

  playButton: {
    icon: "icon icon-play",
    style: {
      position: "absolute",
      top: "50%",
      left: "50%",
      fontSize: "25",
      transform: "translate(-50%, -50%)",
      opacity: 1,
      color: "white",
      transition: "opacity .25s ease-in-out"
    }
  },

  contentMetadataContainer: {
    position: "absolute",
    top: "0",
    left: "20%",
    width: "78%",
    height: "100%",
  },

  upNextTitle: {
    position: "absolute",
    top: "5",
    left: "10",
    width: "100%",
    height: "40%",
    color: "white"
  },

  upNextTitleText: {
    position:"absolute",
    left:40,
    right: 0,
    height: "100%",
    fontSize: 20,
  },

  contentDescription: {
    position: "absolute",
    bottom: "0",
    left: "0",
    width: "70%",
    height: "60%",
    color: "white",
    fontSize: 10,
  },

  dismissButton: {
    position: "absolute",
    right: "2%",  
    top: "15%",
    height: "40%",
    width: "13%",
    fontSize: "10",
    backgroundColor: "black",
    "border": "1px solid white",
    "border-radius": "5px"
  },  

  dismissButtonText: {
    position: "absolute",
    top: "50%",
    width: "100%",
    fontSize: "20",
    color: "white",
    "cursor": "pointer",

    "text-align": "center",
    "-webkit-transform": "translateY(-50%)",
    "-ms-transform": "translateY(-50%)",
    "transform": "translateY(-50%)",
  },

  upNextCountDownStyle: {
    height: "38px",
    width: "38px"
  }
};

var MoreOptionsScreenStyle = {
  panelStyle: {
    "position": "absolute",
    "top": "0",
    "left": "0",
    "width": "100%",
    "height": "100%",
    "opacity": "0.7",
    "backgroundColor": "black"
  },

  buttonListStyle: {
    "position": "absolute",
    "bottom": "0%",
    "left": "30%",
    "right": "30%",
    "width": "40%",
    "height": "32",
    "opacity": "0",
    "listStyle": "none",
    "display": "flex",
    "flexFlow": "row nowrap",
    "justifyContent": "flex-start",
    "-webkit-user-select": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "user-select": "none",
    "-webkit-flex-direction": "row",
    "flex-direction": "row",
    "transition": "bottom 0.7s, opacity 0.7s",
  },

  buttonStyle: {
    "height": "100%",
    "color": "rgba(255, 255, 255, 0.6)",
    "fontWeight": "bold",
    "fontSize": "18",
    "textAlign": "center",
    "paddingLeft": "8px",
    "paddingRight": "8px",
    "margin": "0 auto",
    "opacity": "1",
  },

  closeButtonStyle: {
    "position": "absolute", 
    "top": "10", 
    "right": "10", 
    "color": "lightgray"
  },
};