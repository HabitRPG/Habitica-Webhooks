'use strict';

let request = require('superagent');
let AWS = require('aws-sdk');

let config = require('./config');

AWS.config.update({
  accessKeyId: config.get('S3_ACCESS_KEY'),
  secretAccessKey: config.get('S3_SECRET_KEY'),
  region: config.get('S3_REGION'),
});

let BUCKET_NAME = config.get('S3_BUCKET_NAME');
let s3 = new AWS.S3();

let uploadFile = (buffer, fileName) => {
  // Adapted from http://stackoverflow.com/a/22210077/2601552

  s3.putObject({
    Body: buffer,
    Key: fileName,
    Bucket: BUCKET_NAME,
  }, (error) => {
    if (error) {
      console.error(`ERROR: ${error}`);
    } else {
      console.info(`${fileName} uploaded to ${BUCKET_NAME} succesfully.`);
    }
  });
};

let getFileFromUrlAndUpload = (url, name, cb) => {
  request.get(url)
    .end((err, res) => {
      if (err) {
        console.error(err);
      } else {
        let file = res.body;
        uploadFile(file, name);
      }

      if (cb) cb();
    });
};

module.exports = {
  getFileFromUrlAndUpload: getFileFromUrlAndUpload,
  uploadFile: uploadFile,
};
