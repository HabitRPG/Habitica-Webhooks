let request = require('superagent');
let AWS = require('aws-sdk');

let config = require('./../config.json');

AWS.config.loadFromPath('./config.json');
let BUCKET_NAME = config.BUCKET_NAME;
let s3 = new AWS.S3();

let uploadFile = (buffer, fileName) => {
  // Adapted from http://stackoverflow.com/a/22210077/2601552

  s3.putObject({
    Body: buffer,
    Key: fileName,
    Bucket: BUCKET_NAME
  }, (error, data) => {
    if (error) {
      console.log('ERROR: #{error}');
    } else {
      console.log('#{fileName} uploaded to #{BUCKET_NAME} succesfully.');
    }
  });
}

let getFileFromUrlAndUpload = (url, name) => {
  request.get(url)
    .end((err, res) => {
      if (err) { console.log(err); }

      var file = res.body;
      uploadFile(file, name);
    });
}

module.exports = {
  getFileFromUrlAndUpload: getFileFromUrlAndUpload,
  uploadFile: uploadFile
}

