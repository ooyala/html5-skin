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
      "transition": "bottom 0.5s, height 0.25s"
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
      "WebkitFilter": "drop-shadow(0px 0px 3px rgba(255,255,255,0.8))",
      "filter": "drop-shadow(0px 0px 3px rgba(255,255,255,0.8))",
      "msFilter": "progid:DXImageTransform.Microsoft.Dropshadow(OffX=0, OffY=0, Color='#fff')"
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
  
  adOverlayStyle: {
    style: {
    },

    overlayImageStyle: {
    },

    closeButtonStyle: {
    },

    closeButtonIconStyle: {
    }
  },

  closedCaptionScreenStyles: {

    screenStyle: {
      backgroundColor: "rgba(0,0,0,0.8)",
      height: "100%",
      width: "100%"
    },

    closeButtonStyle: {
      position: "absolute",
      right: "35px",
      top: "35px",
      cursor: "pointer"
    },

    innerPanelStyle: {
      padding: "35px"
    },

    captionStyle: {
      fontSize: "28pt",
      fontFamily: "'Roboto Condensed', sans-serif",
      color: "#ffffff",
      fontWeight: "bold"
    },

    captionIconStyle: {
      fontSize: "25pt"
    },

    switchStyle: {
      cursor: "pointer",
      marginTop: "35px",
      height: "21px",
      width: "105px",
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
      borderRadius: "40",
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

    onStyle: {
      position: "absolute",
      right: "0",
      display: "inline-block",
      color: "grey",
      fontSize: "15pt",
      fontFamily: "'Roboto', sans-serif"
    },

    offStyle: {
      position: "absolute",
      display: "inline-block",
      left: "0",
      color: "grey",
      fontSize: "15pt",
      fontFamily: "'Roboto', sans-serif"
    },

    itemStyle: {
      fontSize: "22pt",
      fontFamily: "'Roboto Condensed', sans-serif",
      width: "140px",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      marginRight: "128px",
      marginTop: "28px",
      textAlign: "center",
      padding: "4px",
      color: "white",
      transition: "all 0.0s ease",
      cursor: "pointer"
    },

    lastColumnItemStyle: {
      fontSize: "22pt",
      fontFamily: "'Roboto Condensed', sans-serif",
      width: "140px",
      minwidth: "100px",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      marginRight: "0px",
      marginTop: "28px",
      textAlign: "center",
      padding: "4px",
      color: "white",
      transition: "all 0.0s ease",
      cursor: "pointer"
    },

    itemSelectedStyle: {
      fontSize: "22pt",
      fontFamily: "'Roboto Condensed', sans-serif",
      width: "140px",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      marginRight: "128px",
      marginTop: "28px",
      textAlign: "center",
      padding: "4px",
      color: "white",
      //properties different from itemStyle
      backgroundColor: "#4389ff",
      borderRadius: "8px",
      cursor: "pointer"
    },

    lastColumnItemSelectedStyle: {
      fontSize: "22pt",
      fontFamily: "'Roboto Condensed', sans-serif",
      width: "140px",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      marginRight: "0px",
      marginTop: "28px",
      textAlign: "center",
      padding: "4px",
      color: "white",
      //properties different from itemStyle
      backgroundColor: "#4389ff",
      borderRadius: "8px",
      cursor: "pointer"
    },

    closedCaptionChevronLeftButtonContainer: {
      position: "absolute",
      backgroundColor: "transparent",
      height: "100%",
      width: "50px",
      color: "white",
      left: "0px",
      cursor: "pointer"
    },

    closedCaptionChevronRightButtonContainer: {
      position: "absolute",
      backgroundColor: "transparent",
      height: "100%",
      width: "50px",
      color: "white",
      right: "0px",
      cursor: "pointer"
    },

    closedCaptionChevronLeftButton: {
      style: {
        top: "50%",
        left: "50%",
        fontSize: "32pt",
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
        fontSize: "32pt",
        transform: "translate(-50%, -50%)",
        position: "absolute",
        opacity: 1,
        transition: "opacity .25s ease-in-out"
      }
    },

    tableLanguageContainerStyle: {
      overflowX: "hidden",
      marginLeft: "50px",
      marginRight: "50px",
      resize: "none"
    },

    tableLanguageStyle: {
      borderCollapse: "collapse"
    },

    tdLanguageStyle: {
      paddingLeft: "0px",
      paddingRight: "0px"
    },

    CCPreviewPanelStyle: {
      width: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      position: "absolute",
      bottom: "15px",
      left: "0",
      height: "70px",
      borderTop: "1px solid grey",
      visibility: "visible"
    },

    CCPreviewCaptionStyle: {
      color: "white",
      fontSize: "12pt",
      fontFamily: "'Roboto', sans-serif",
      marginLeft: "35px",
      marginBottom: "5.5px",
      marginTop: "5.5px"
    },

    CCPreviewTextStyle: {
      marginTop: "0px",
      color: "white",
      fontSize: "24pt",
      fontWeight: "bold",
      fontFamily: "Verdana",
      marginLeft: "35px"
    },

    positionRelativeStyle: {
      position: "relative"
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