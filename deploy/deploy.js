// Deploy v4 plugins to s3.
var TOKEN = process.env.AWS_ACCESS_KEY_ID;
var SECRET = process.env.AWS_SECRET_ACCESS_KEY;
var BUCKET = "xd-team.ooyala.com";

var fs = require('fs'),
    mime = require('mime'),
    aws = require('aws-sdk');

aws.config.update({accessKeyId: TOKEN, secretAccessKey: SECRET});
var s3 = new aws.S3();

var s3Path = "v4-plugins";
var deployToSandbox = process.env.deploy_to == "sandbox";

//List of files to upload
var deployPath;
if (deployToSandbox) {
  deployPath = process.env.deploy_to + "/" + process.env.sandbox_folder;
} else {
  deployPath = process.env.deploy_to;
}

var filePaths = [
  {
    localPath: __dirname + "/../build/html5-skin.js",
    remotePaths: [
      s3Path + "/" + deployPath + "/html5-skin.js",
      s3Path + "/" + process.env.version + "/html5-skin.js"
    ]
  }
];

try {
  for (var i = 0; i < filePaths.length; i++) {
    var localFilePath = filePaths[i].localPath;
    var remotePaths = filePaths[i].remotePaths;
    var fileBuffer = fs.readFileSync(localFilePath);

    //If we are deploying to sandbox, we don't want to deploy it to its own version folder
    if (deployToSandbox) {
      remotePaths.splice(1, 1);
    }

    for (var j = 0; j < remotePaths.length; j++) {
      var remoteFilePath = remotePaths[j];

      console.log("Deploying " + localFilePath + " to " + BUCKET + "/" + remoteFilePath);
      var params = {
        Bucket: BUCKET,
        Key: remoteFilePath,
        Body: fileBuffer,
        ContentLength: fileBuffer.length,
        ContentType: mime.lookup(localFilePath),
        CacheControl: "max-age=600",
        ACL: 'public-read'
      };
      s3.putObject(params, function(err, data) {
        if (err) {
          throw "Error in deploy:" + err;
        }
      });
    }
  }
} catch (e) {
  throw e;
}