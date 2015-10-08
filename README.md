# html5-skin
An open-source HTML5 UI skin based on [ReactJS](https://github.com/facebook/react) that overlays Ooyala V4 core player.

## Requirement
- Ooyala player is a requirement. To know more, visit: [www.ooyala.com](http://www.ooyala.com)
- React JS to render virtual DOM

## Examples
```javascript
<!DOCTYPE html>
<html>
<head>
  <script language="javascript" src="//player.ooyala.com/static/v4/latest/core.min.js"></script>
  <script language="javascript" src="//player.ooyala.com/static/v4/latest/discovery_api.min.js"></script>
  <link rel="stylesheet" href="//player.ooyala.com/static/v4/latest/html5-skin/assets/styles.css"/>
  <script src="//player.ooyala.com/static/v4/latest/html5-skin/build/html5-skin.min.js"></script>
</head>

<body>
<div id='container' style='width:640px; height:360px;'></div>
<script>
  var playerParam = {
    "pcode": "YOUR_PCODE",
    "playerBrandingId": "YOUR_PLAYER_ID",
    "debug":true,
    "skin": {
      "config": "//player.ooyala.com/static/v4/latest/html5-skin/config/skin.json",
      "languages": [
        {language: "en", languageFile: "//player.ooyala.com/static/v4/latest/html5-skin/config/en.json"},
      ]
    }
  };
  OO.ready(function() {
    window.pp = OO.Player.create('container', 'RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2', playerParam);
  });
</script>

</body>
</html>
```

We have a sample HTML page ready for you. Check out [sample page](./sample.html)

## Structure and Data Flow
Html5-skin application has 2 major parts: the __controller__ and the __skin-placeholder__ (Modular React Component). The controller serves as a __Message Bus__ bridge between the core player and the UI skin, by publishing and listening the corresponding events from the player. It will then decide necessary components for skin-placeholder to show.

<img src="./docs/img/alice-skeleton.jpg" style="width: 100%;" />

Html5-skin favors single directional information flow. User interaction passes information to controller for event publishing. Controller then listens to events from core player, adjusts skin __state__ and finally decides skin React components to load. Skin state is owned by controller and may not be changed by skin-placeholder.

## Developer help tool
You need [npm](https://www.npmjs.org/) installed on your computer.
From the root project directory run these commands from the command line:

    npm install

This will install all dependencies.

This project also makes use of a git submodule for the config file. This needs to be initialized
using the git submodule commands:

    git submodule init
    git submodule update
    git pull

The init and update should only need to be run once, afterward git pull will
update the submodule as well as the parent repo.

To build the project, first run this command:

    sudo npm install -g gulp

This will install gulp module globally. Then, simply run this command:

    gulp

This will perform an initial build and start a watch that will update build/html5-skin.js with any changes you wish to make in js folder.

If you have the forever module installed, you can use the following command to keep gulp running:

    forever --spinSleepTime 5000 --workingDir <path to your project directory> /usr/local/bin/gulp

Once you've built the Javascript with gulp, you'll need to run a webserver in order to serve sample.html.
The simplest way to do this is with python's built in server, but you can use any server you like.
To start a python server, cd into the repo directory and run:

    python -m SimpleHTTPServer

You should now be able to load the sample page by hitting http://localhost:8000/sample.html

## Testing
To run tests, run this command:

    npm test

Add test files to directory `tests/`.

Test file should have same location and name as `js/` file with `-test` after test file name.

For example, component file `js/components/sharePanel.js` will have test file `tests/components/sharePanel-test.js`.

## Publisher and Ooyala Customer
Able to fork git repo, build and host V4 plugins at will. Terms and condition apply.

## Advance
### Location
Latest V4 core player and plugins, including ads, discovery and skin, are served in player.ooyala.com/static/v4/latest/*. This is equivalent to the most up-to-date vX_Y_Z release version served in player.ooyala.com/static/v4/vX_Y_Z/*.

### Plug and Play capability
core.js is a lightweight core player that enables basic video playback functionality and provides Message Bus environment. Most of additional capabilities such as ads, discovery and skin are separated from core. You may wish to load additional plugin.

### Skin Customization
Simple customization can be achieved by modifying skin.json setting. Furthermore, you are able to override skin setting during player create time. The example below hides Play button on start screen.

```javascript
var playerParam = {
  "skin": {
    "config": "//player.ooyala.com/static/v4/latest/html5-skin/config/skin.json",
    "languages": [
      {language: "en", languageFile: "//player.ooyala.com/static/v4/latest/html5-skin/config/en.json"},
    ],
    "inline": {
      "startScreen": {"showPlayButton": false}
    }
  }
};
```

For advance customization requires developer to fork open-source skin repository. Any code, setting and behavior can be altered.
