var defaultScreenStyle = {
  style: {
    width: "100%",
    height:"100%"
  }
};

var startScreenStyle = {
  style: {
    width: "100%",
    height: "100%",
    position: "absolute",
    overflow: "hidden",
    background: "black"
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
        color: "inherit",
        resize: "none"
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
    style: {
      fontSize: "72",
      WebkitTransform: "translate(-50%, -50%)",
      transform: "translate(-50%, -50%)",
      position: "absolute",
      opacity: 1,
      transition: "opacity .25s ease-in-out",
      "cursor": "pointer"
    }
  }
};

var pauseScreenStyle = {
  style: {
    width: "100%",
    height: "100%",
    position: "absolute",
    overflow: "hidden"
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
        color: "inherit",
        resize: "none"
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
    style: {
      fontSize: "24",
      position: "absolute",
      WebkitTransform: "translate(-50%, -50%)",
      transform: "translate(-50%, -50%)",
      opacity: 1,
      transition: "all 1s",
      "cursor": "pointer"
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
  backgroundStyle: {
    height: "100%",
    width: "100%",
    position: "absolute",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    background: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 100%)"
  },
  repeatButton: {
    style: {
      top: "50%",
      left: "50%",
      fontSize: "75px",
      WebkitTransform: "translate(-50%, -50%)",
      transform: "translate(-50%, -50%)",
      position: "absolute",
      opacity: 1,
      transition: "opacity .25s ease-in-out",
      "cursor": "pointer"
    }
  }
};

var errorScreenStyle = {
  style: {
    "width": "100%",
    "height": "100%",
    "position": "absolute",
    "overflow": "hidden",
    "background": "black"
  },
  contentStyle: {
    "width": "80%",
    "position": "relative",
    "top": "50%",
    "textAlign": "left",
    "transform": "translateY(-50%)",
    "WebkitTransform": "translateY(-50%)",
    "wordWrap": "break-word",
    "display": "block",
    "marginLeft": "auto",
    "marginRight": "auto"
  },
  titleStyle: {
    "color": "white",
    "fontSize": "20pt",
    "fontFamily": "Roboto",
    "fontWeight": "bold",
    "textTransform": "uppercase",
    "marginBottom": "30"
  },
  descriptionStyle: {
    "color": "white",
    "fontSize": "14pt",
    "fontFamily": "Open Sans",
    "fontWeight": "regular",
    "marginBottom": "30"
  },
  actionStyle: {
    "color": "#4389FF",
    "fontSize": "14pt",
    "fontFamily": "Open Sans",
    "fontWeight": "regular",
    "textTransform": "uppercase"
  }
};

var controlBarStyle = {
  controlBarSetting: {
    "background": "rgba(0, 0, 0, 0.3)",
    "width": "100%",
    "bottom": "0%",
    "position": "absolute",
    "margin": 0,
    "fontSize": "18px",
    "listStyle": "none",
    "display": "flex",
    "flexFlow": "row nowrap",
    "justifyContent": "flex-start",
    "WebkitUserSelect": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "userSelect": "none",
    "transition": "bottom 0.5s, height 0.25s"
  },

  controlBarItemSetting: {
    "height": "100%",
    "color": "rgba(255, 255, 255, 0.6)",
    "fontWeight": "bold",
    "fontSize": "18px",
    "textAlign": "center",
    "paddingLeft": "7.5px",
    "paddingRight": "7.5px",
    "cursor": "pointer"
  },

  durationIndicatorSetting: {
    "height": "100%",
    "color": "#ffffff",
    "opacity": 1,
    "fontSize": 14,
    "textAlign": "left",
    "flex": 1,
    "WebkitFlex": 1
  },

  iconSetting: {
  },

  flexibleSpace: {
    "flex": 1,
    "WebkitFlex": 1
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
    "backgroundClip": "content-box",
    "position": "relative",
    "width": "4px",
    "height": "18px",
    "paddingRight": "3px"
  },

  watermarkImageStyle: {
    "position": "relative",
    "height": "18px",
    "top": "21px",
  }
};

var scrubberBarStyle = {
  scrubberBarSetting: {
    "background": "#afafaf",
    "width": "100%",
    "height": "5",
    "padding": 0,
    "margin": 0,
    "top": "50%",
    "position": "absolute"
  },

  scrubberBarPadding: {
    "padding": "0",
    "margin": "0",
    "WebkitUserSelect": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "userSelect": "none",
    "position": "absolute",
    "transition": "bottom 0.5s, height 0.25s",
    "width": "100%",
    "height": "30px",
    "zIndex": "1"
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

  playheadPaddingStyle: {
    "width": "25px",
    "height": "25px",
    "position": "absolute",
    "zIndex": "1",
    "top": "50%",
    "WebkitTransform": "translateY(-50%) translateX(-50%)",
    "transform": "translateY(-50%) translateX(-50%)",
    "transition": "opacity 0.25s"
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
    "transition": "opacity 0.25s",
    "top": "50%",
    "cursor":"pointer",
    "left": "50%",
    "WebkitTransform": "translateY(-50%) translateX(-50%)",
    "transform": "translateY(-50%) translateX(-50%)"
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
    fontWeight: "bold",
    cursor: "pointer"
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
    WebkitFlex: 1,
    textAlign: "left",
    paddingLeft: "25px",
    cursor: "pointer"
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
    borderRadius: "6px",
    cursor: "pointer"
  },

  panelStyle: {
    backgroundColor: "#3a3a3a",
    bottom: 0,
    flex: 1,
    WebkitFlex: 1,
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
    flexDirection: "column",
    WebkitFlexDirection: "column"
  },

  tabRowStyle: {
    borderBottom: "1px solid #afafaf",
    display: "flex",
    flexDirection: "row",
    WebkitFlexDirection: "row"
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
    paddingLeft: "15px",
    resize: "none"
  },

  emailSendButton: {
    backgroundColor:"#4389ff",
    border: "0px none transparent",
    borderRadius: "6px",
    height: "40px",
    width: "70px",
    marginTop: "8px",
    cursor: "pointer"
  },

  emailInputField: {
    color:"gray",
    marginBottom: "15px",
    borderRadius: "6px",
    borderStyle: "none",
    width: "300px",
    height: "32px",
    paddingLeft: "15px",
    resize: "none"
  },

  emailTextArea: {
    color: "gray",
    height: "80px",
    width: "300px",
    borderRadius: "6px",
    resize: "none"
  },

  startAtInput: {
    color:"black",
    borderRadius: "6px",
    borderStyle: "none",
    width: "60px",
    height: "26px",
    paddingLeft: "10px",
    resize: "none"
  },

  embedTextArea: {
    height: "60%",
    width: "70%",
    color: "black",
    borderRadius: "6px",
    resize: "none"
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
    lineHeight: "25px",
    cursor: "pointer"
  }
};

var discoveryScreenStyle = {

  panelStyle: {
    position: "absolute",
    bottom: "60px",
    backgroundColor: "rgba(0,0,0, 0.7)",
    left: 0,
    right: 0,
    display: "flex",
    flexDirection: "row",
    WebkitFlexDirection: "row",
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
    left: "40px",
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
    width: "100%",
    overflow: "hidden"
  },

  discoveryToasterStyle: {
    position: "absolute",
    top: "0",
    height: "90%",
    width: "0",
    right: 0,
    left: 25,
    display: "flex",
    flexDirection: "row",
    WebkitFlexDirection: "row"
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
    style: {
      top: "50%",
      left: "50%",
      fontSize: "18",
      WebkitTransform: "translate(-50%, -50%)",
      transform: "translate(-50%, -50%)",
      position: "absolute",
      opacity: 1,
      transition: "opacity .25s ease-in-out",
      cursor: "pointer"
    }
  },

  discoveryChevronRightButton: {
    style: {
      top: "50%",
      left: "50%",
      fontSize: "18",
      WebkitTransform: "translate(-50%, -50%)",
      transform: "translate(-50%, -50%)",
      position: "absolute",
      opacity: 1,
      transition: "opacity .25s ease-in-out",
      cursor: "pointer"
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
    fontSize: "22",
    fontWeight: "regular",
    textOverflow: "ellipsis",
    width: "214px",
    height: "31px",
    overflow: "hidden",
    whiteSpace: "nowrap"
  },

  discoveryCountDownWrapperStyle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    WebkitTransform: "translate(-50%, -50%)",
    transform: "translate(-50%, -50%)"
  },

  discoveryCountDownStyle: {
    width: "75px",
    height: "75px"
  },

  discoveryCountDownIconStyle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    WebkitTransform: "translate(-50%, -50%)",
    transform: "translate(-50%, -50%)",
    "line-height":"40px",
    "z-index":10005,
    "color":"white",
    fontSize: 25,
    cursor: "pointer"
  },
};

var adScreenStyle = {
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
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "userSelect": "none",
    "transition": "bottom 0.5s, height 0.2 5s"
  },

  adPanelTopBarTextStyle: {
    "fontSize": "12pt",
    "color": "white",
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
    "color": "black",
    "backgroundColor": "white",
    "margin": "auto",
    "marginRight": "15px",
    "textAlign": "center",
    "padding": "4px",
    "border-radius": "5px",
  },

  skipButtonStyle: {
    "fontSize": "12pt",
    "color": "black",
    "backgroundColor": "white",
    "margin": "auto",
    "marginRight": "15px",
    "textAlign": "center",
    "padding": "4px",
    "border-radius": "5px",
  },
};

var closedCaptionScreenStyles ={

  screenStyle: {
    backgroundColor: "rgba(0,0,0,0.8)",
    height: "100%",
    width: "100%"
  },

  closeButtonStyle: {
    position: "absolute",
    right: "17.5",
    top: "17.5",
    height: "25",
    width: "25",
    color: "lightgray",
    cursor: "pointer"
  },

  innerPanelStyle :{
    padding: "17.5"
  },

  captionStyle: {
    fontSize: "16pt",
    fontFamily: "Roboto Condensed",
    color: "#ffffff",
    fontWeight: "bold"
  },

  switchStyle:{
    cursor: "pointer",
    marginTop: "17.5",
    height: "14",
    width: "70",
    fontSize: "10pt",
    color: "#FFFFFF",
    position: "relative"
  },

  switchContainer: {
    display: "inline-block",
    width: "33%",
    height: "100%",
    position: "relative",
    marginLeft: "33%",
    borderRadius: "100%"
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
    right: "0",
    display:"inline-block",
    color: "grey"
  },

  offStyle:{
    position: "absolute",
    display:"inline-block",
    left: "0",
    color: "grey"
  },

  itemStyle: {
    fontSize: "11pt",
    width: "70",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    marginRight: "64",
    marginTop: "14",
    textAlign: "center",
    padding: "2",
    color: "white",
    transition: "all 0.0s ease",
    cursor: "pointer"
  },

  lastColumnItemStyle: {
    fontSize: "11pt",
    width: "70",
    minwidth: "50",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    marginRight: "0",
    marginTop: "14",
    textAlign: "center",
    padding: "2",
    color: "white",
    transition: "all 0.0s ease",
    cursor: "pointer"
  },

  itemSelectedStyle: {
    fontSize: "11pt",
    width: "70",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    marginRight: "64",
    marginTop: "14",
    textAlign: "center",
    padding: "2",
    color: "white",
    //properties different from itemStyle
    backgroundColor: "#4389ff",
    borderRadius: "4",
    cursor: "pointer"
  },

  lastColumnItemSelectedStyle:{
    fontSize: "11pt",
    width: "70",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    marginRight: "0",
    marginTop: "14",
    textAlign: "center",
    padding: "2",
    color: "white",
    //properties different from itemStyle
    backgroundColor: "#4389ff",
    borderRadius: "4",
    cursor: "pointer"
  },

  closedCaptionChevronLeftButtonContainer: {
    position: "absolute",
    backgroundColor: "transparent",
    height: "100%",
    width: "25px",
    color:"white",
    left: "0",
    cursor: "pointer"
  },

  closedCaptionChevronRightButtonContainer: {
    position: "absolute",
    backgroundColor: "transparent",
    height: "100%",
    width: "25px",
    color:"white",
    right: "0",
    cursor: "pointer"
  },

  closedCaptionChevronLeftButton: {
    style: {
      top: "50%",
      left: "50%",
      fontSize: "16pt",
      transform: "translate(-50%, -50%)",
      position: "absolute",
      opacity: 1,
      transition: "opacity .25s ease-in-out"
    }
  },

  closedCaptionChevronRightButton: {
    style: {
      top: "50%",
      left: "50%",
      fontSize: "16pt",
      transform: "translate(-50%, -50%)",
      position: "absolute",
      opacity: 1,
      transition: "opacity .25s ease-in-out"
    }
  },

  tableLanguageContainerStyle: {
    overflowX:"hidden",
    marginLeft: "25",
    marginRight: "25",
    resize: "none"
  },

  tableLanguageStyle: {
    borderCollapse: "collapse"
  },

  tdLanguageStyle: {
    paddingLeft: "0",
    paddingRight: "0"
  },

  CCPreviewPanelStyle:{
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "absolute",
    bottom: "67.5",
    left: "0",
    height: "35",
    borderTop: "1px solid grey",
    visibility: "visible"
  },

  CCPreviewCaptionStyle: {
    color: "white",
    fontSize: "6pt",
    fontFamily: "Roboto",
    marginLeft: "17.5",
    marginBottom: "2.75",
    marginTop: "2.75",
  },

  CCPreviewTextStyle: {
    marginTop: "0",
    color: "white",
    fontSize: "12pt",
    fontWeight: "bold",
    fontFamily: "Verdana",
    marginLeft: "17.5"
  },

  positionRelativeStyle: {
    position: "relative"
  }
};

var upNextPanelStyle = {
  panelStyle: {
    position: "absolute",
    width: "100%",
    height: "80px",
    right: "0",
    bottom: "32px",
    backgroundColor: "rgba(22, 22, 22, 0.9)",
    "transition": "bottom 0.5s"
  },

  contentImageContainerStyle: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "140px",
    height: "100%",
    cursor: "pointer"
  },

  contentImageStyle: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%"
  },

  playButton: {
    style: {
      position: "absolute",
      top: "50%",
      left: "50%",
      fontSize: "25",
      WebkitTransform: "translate(-50%, -50%)",
      transform: "translate(-50%, -50%)",
      opacity: 1,
      color: "white",
      transition: "opacity .25s ease-in-out"
    }
  },

  contentMetadataContainerStyle: {
    position: "absolute",
    top: "0",
    left: "140px",
    width: "78%",
    height: "100%",
  },

  upNextTitleStyle: {
    position: "absolute",
    display: "flex",
    top: "5",
    left: "15px",
    width: "100%",
    height: "27px",
    color: "#FFFFFF",
  },

  upNextTitleTextStyle: {
    fontSize: "18",
    fontWeight: "bold",
    maxWidth: "70%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: "inherit",
    resize: "none",
    "padding-left": "10",
  },

  contentDescriptionStyle: {
    position: "absolute",
    bottom: "0",
    left: "15px",
    width: "70%",
    height: "40px",
    marginTop: "10px",
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    fontWeight: "bold"
  },

  closeButton: {
    position: "absolute",
    top:"10px",
    right: "10px",
    height: "10px",
    width: "10px",
    backgroundColor: "transparent",
    color: "white",
    fontSize: "10px",
    "cursor": "pointer",
    "text-align": "center",
    "WebkitTransform": "translateY(-50%)",
    "-ms-transform": "translateY(-50%)",
    "transform": "translateY(-50%)",
  },

  upNextCountDownStyle: {
    height: "27px",
    width: "27px"
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
    "WebkitUserSelect": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "userSelect": "none",
    "WebkitFlexDirection": "row",
    "flexDirection": "row",
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
    "cursor": "pointer"
  },

  closeButtonStyle: {
    "position": "absolute",
    "top": "10",
    "right": "10",
    "color": "lightgray",
    "cursor": "pointer"
  },
};