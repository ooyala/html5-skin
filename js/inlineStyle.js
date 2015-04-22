startScreenStyle = {
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
    backgroundPosition: "center",
    visibility: "hidden"
  },
  infoPanel: {
    style: {
      position: "absolute",
      bottom: "3%",
      left: "3%",
      width: "100%"
    },
    title: {
      style: {
        fontSize: "32px",
        color: "rgba(255, 255, 255, 1)",
        fontWeight: "bold",
        maxWidth: "70%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    },
    description: {
      style: {
        fontSize: "24",
        color: "rgba(255, 255, 255, 1)",
        maxWidth: "70%",
        overflow: "visible"
      }
    }
  },
  playButton: {
    icon: "glyphicon glyphicon-play",
    style: {
      fontSize: "72",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      position: "absolute",
      opacity: 1,
      transition: "opacity .25s ease-in-out",
      color:"white"
    }
  }
};