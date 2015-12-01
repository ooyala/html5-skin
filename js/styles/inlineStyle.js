module.exports = {
  defaultScreenStyle: {
    style: {
      width: "100%",
      height: "100%"
    },
    closeButtonStyle: {
      "opacity":"0.6",
      "color": "#ffffff"
    }
  },

  startScreenStyle: {
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
        width: "100%"
      },
      title: {
        style: {
          fontWeight: "bold",
          maxWidth: "70%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          resize: "none",
          marginBottom: "15px"
        }
      },
      description: {
        style: {
          maxWidth: "70%",
          overflow: "visible",
          clear: "both"
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
  },

  spinnerStyle: {
    spinner: "assets/images/loading.png",
    style: {
      width: "10%",
      WebkitTransform: "translate(-50%, -50%) rotate(90deg)",
      MozTransform: "translate(-50%, -50%) rotate(90deg)",
      msTransform: "translate(-50%, -50%) rotate(90deg)",
      transform: "translate(-50%, -50%) rotate(90deg)",
      position: "absolute",
      left: "50%",
      top: "50%",
      opacity: 1,
      color: "white",
      transition: "opacity .25s ease-in-out",
      "cursor": "pointer",
      WebkitAnimation: "spin 4s linear infinite",
      MozAnimation: "spin 4s linear infinite",
      msAnimation: "spin 4s linear infinite",
      animation: "spin 4s linear infinite"
    }
  },

  pauseScreenStyle: {
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
          fontWeight: "bold",
          maxWidth: "70%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          resize: "none",
          marginBottom: "15px"
        }
      },
      description: {
        style: {
          maxWidth: "70%",
          overflow: "visible",
          clear: "both"
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
    },
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

  endScreenStyle: {
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
      "marginTop": "6px"
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

  shareScreenStyle: {
    tabStyle: {
      display: "inline-block",
      color: "#afafaf",
      fontWeight: "bold",
      paddingRight: "25px"
    },

    lastTabStyle: {
      display: "inline-block",
      color: "#afafaf",
      fontWeight: "bold",
      flex: 1,
      WebkitFlex: 1,
      paddingLeft: "0"
    },

    activeTab: {
      color: "white"
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

    twitterIconStyle: {
      backgroundColor: "#64ccea"
    },

    facebookIconStyle: {
      backgroundColor: "#517db8"
    },

    plusIconStyle: {
      backgroundColor: "#ff6267"
    },

    panelStyle: {
      flex: 1,
      WebkitFlex: 1,
      color: "white",
      textAlign: "center"
    },

    containerStyle: {
      padding: "35px",
      position: "absolute",
      top: 0,
      bottom: "0",
      background: "rgba(0, 0, 0, 0.75)",
      left: 0,
      right: 0,
      display: "flex",
      alignItems: "center",
      WebkitAlignItems: "center",
      justifyContent: "center"
    },

    tabRowStyle: {
      position: "absolute",
      top: "35px",
      left: "35px"
    },

    titleStyle: {
      fontFamily: "'Roboto Condensed', sans-serif",
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "15px",
      textTransform: "capitalize"
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

    emailTable: {
      color: "white",
      margin: "0 auto"
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
      top: "35px",
      right: "35px",
      height: "15px",
      width: "15px",
      color: "#ffffff",
      textAlign: "center",
      lineHeight: "15px"
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
      "marginRight": "30px",
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

  upNextPanelStyle: {
    panelStyle: {
      "position": "absolute",
      "width": "100%",
      "height": "80px",
      "right": "0",
      "bottom": "32px",
      "backgroundColor": "rgba(22, 22, 22, 0.9)",
      "transition": "bottom 0.5s"
    },

    contentImageContainerStyle: {
      "position": "absolute",
      "top": "0",
      "left": "0",
      "width": "140px",
      "height": "100%",
      "cursor": "pointer"
    },

    contentImageStyle: {
      "position": "absolute",
      "top": "50%",
      "left": "50%",
      "WebkitTransform": "translate(-50%, -50%)",
      "transform": "translate(-50%, -50%)",
      "maxWidth":"100%",
      "maxHeight":"100%",
      "width": "auto",
      "height": "auto"
    },

    playButton: {
      style: {
        "position": "absolute",
        "top": "50%",
        "left": "50%",
        "fontSize": "25",
        "WebkitTransform": "translate(-50%, -50%)",
        "transform": "translate(-50%, -50%)",
        "opacity": 1,
        "color": "white",
        "transition": "opacity .25s ease-in-out"
      }
    },

    contentMetadataContainerStyle: {
      "position": "absolute",
      "top": "0",
      "left": "140px",
      "width": "78%",
      "height": "100%"
    },

    upNextTitleStyle: {
      "position": "absolute",
      "display": "flex",
      "top": "3px",
      "left": "15px",
      "width": "100%",
      "color": "#FFFFFF"
    },

    upNextTitleTextStyle: {
      "fontSize": "18pt",
      "fontFamily": "'Roboto Condensed', sans-serif",
      "fontWeight": "bold",
      "maxWidth": "70%",
      "whiteSpace": "nowrap",
      "overflow": "hidden",
      "textOverflow": "ellipsis",
      "color": "inherit",
      "resize": "none"
    },

    contentDescriptionStyle: {
      "position": "absolute",
      "bottom": "5px",
      "left": "15px",
      "width": "70%",
      "marginTop": "10px",
      "color": "rgba(255, 255, 255, 0.6)",
      "fontSize": "12pt",
      "fontFamily": "'Open Sans', sans-serif",
      "fontWeight": "regular",
      "overflow": "hidden",
      "textOverflow": "ellipsis"
    },

    closeButton: {
      "position": "absolute",
      "top": "10px",
      "right": "10px",
      "height": "10px",
      "width": "10px",
      "backgroundColor": "transparent",
      "color": "white",
      "fontSize": "10px",
      "cursor": "pointer",
      "textAlign": "center",
      "WebkitTransform": "translateY(-50%)",
      "msTransform": "translateY(-50%)",
      "transform": "translateY(-50%)"
    },

    upNextCountDownStyle: {
      "height": "27px",
      "width": "27px",
      "marginRight": "10px"
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
  },

  errorScreenStyle: {
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
      "fontFamily": "'Open Sans', sans-serif",
      "marginBottom": "30"
    },
    actionStyle: {
      "color": "#4389FF",
      "fontSize": "14pt",
      "fontFamily": "'Open Sans', sans-serif",
      "textTransform": "uppercase"
    }
  }
};