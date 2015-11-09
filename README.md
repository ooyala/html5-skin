# html5-skin
An open-source HTML5 UI skin based on [ReactJS](https://github.com/facebook/react) that overlays Ooyala V4 core player. This README contains introduction, setup and customization sections.

## High Level Overview
html5-skin is a js file that is made available externally to Ooyala core V4 player. It accepts and triggers general Ooyala Message Bus events from and to core player to change the behavior of video playback. All static files necessary to create and run video playback are hosted and can be accessed publicly. This skin repo are available to be git cloned or forked and be modified by developers (terms and condition apply).

### Plug and Play capability
core.js is a lightweight core player that enables basic video playback functionality and provides Message Bus environment. Most of additional capabilities such as ads, discovery and skin are separated from core player JS. You may want to load additional plugin.

## Examples
We have a sample HTML page ready for you. Check out [sample page](http://debug.ooyala.com/ea/index.html?ec=RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2&pbid=26e2e3c1049c4e70ae08a242638b5c40&pcode=5zb2wxOlZcNCe_HVT3a6cawW298X&core_player=http%3A%2F%2Fplayer.ooyala.com%2Fstatic%2Fv4%2Flatest%2Fcore.min.js&html5_skin=http%3A%2F%2Fplayer.ooyala.com%2Fstatic%2Fv4%2Flatest%2Fhtml5-skin%2Fbuild%2Fhtml5-skin.min.js&skin_asset=http%3A%2F%2Fplayer.ooyala.com%2Fstatic%2Fv4%2Flatest%2Fhtml5-skin%2Fassets%2Fstyles.css&skin_config=http%3A%2F%2Fplayer.ooyala.com%2Fstatic%2Fv4%2Flatest%2Fhtml5-skin%2Fconfig%2Fskin.json&ad_plugin=http%3A%2F%2Fplayer.ooyala.com%2Fstatic%2Fv4%2Flatest%2Ffreewheel.min.js&additional_plugins=http%3A%2F%2Fplayer.ooyala.com%2Fstatic%2Fv4%2Flatest%2Fdiscovery_api.min.js&options=%7B%22freewheel-ads-manager%22%3A%7B%22fw_video_asset_id%22%3A%22NqcGg4bzoOmMiV35ZttQDtBX1oNQBnT-%22%2C%22html5_ad_server%22%3A%22http%3A%2F%2Fg1.v.fwmrm.net%22%2C%22fw_android_ad_server%22%3A%22http%3A%2F%2Fg1.v.fwmrm.net%2F%22%2C%22html5_player_profile%22%3A%2290750%3Aooyala_html5%22%2C%22fw_android_player_profile%22%3A%2290750%3Aooyala_android%22%2C%22fw_mrm_network_id%22%3A%22380912%22%7D%7D)

This simple test HTML page can also be hosted on your environment to showcase html5 skin.
```javascript
<!DOCTYPE html>
<html>
<head>
  <!-- V4 JS core is required. Plugins such as skin, discovery and Advertising need to be loaded separately -->
  <script src="//player.ooyala.com/static/v4/latest/core.min.js"></script>
  <script src="//player.ooyala.com/static/v4/latest/discovery_api.min.js"></script>
  <!-- Change these styles.css and html5-skin.js to your local build if necessary -->
  <script src="//player.ooyala.com/static/v4/latest/html5-skin/build/html5-skin.min.js"></script>
  <link rel="stylesheet" href="//player.ooyala.com/static/v4/latest/html5-skin/assets/styles.css"/>
</head>

<body>
<div id='container' style='width:640px; height:360px;'></div>
<script>
  var playerParam = {
    "pcode": "YOUR_PCODE",
    "playerBrandingId": "YOUR_PLAYER_ID",
    "debug":true,
    "skin": {
      // Config contains the configuration setting for player skin. Change to your local config when necessary.
      "config": "//player.ooyala.com/static/v4/latest/html5-skin/config/skin.json"
    }
  };
  OO.ready(function() {
    window.pp = OO.Player.create('container', 'RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2', playerParam);
  });
</script>

</body>
</html>
```

## Developer Setup
This section provides step by step guide on setting up this repo and create simple local hosting.
You need [npm](https://www.npmjs.org/) installed on your computer.
From the root project directory run these commands from the command line:

    npm install

This will install all dependencies.

This project also makes use of a git submodule for the config file. This needs to be initialized
using the git submodule commands:

    git submodule init
    git submodule update
    git submodule foreach git pull origin master

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

## Customization

### Simple Customization
Simple customization can be achieved by modifying skin.json setting. Furthermore, you are able to override skin setting during player create time. The example below hides description text and render playButton blue on start screen.

```javascript
var playerParam = {
  "skin": {
    "config": "//player.ooyala.com/static/v4/latest/html5-skin/config/skin.json",
    "inline": {
      "startScreen": {"showDescription": false, "playIconStyle": {"color": "blue"}}
    }
  }
};
```

### Advanced Customization
Advanced customization is readily available by modifying JS files. Follow _Developer Setup_ section to create a local repository and to run build script. Built files are available inside build folder. You are welcomed to host your built skin javascript to be run with your player.
