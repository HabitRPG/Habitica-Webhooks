'use strict';

let AWS = require('aws-sdk');

let config = require('./config');

AWS.config.update({
  accessKeyId: config.get('S3_ACCESS_KEY'),
  secretAccessKey: config.get('S3_SECRET_KEY'),
  region: config.get('S3_REGION'),
});

let BUCKET_NAME = config.get('S3_BUCKET_NAME');
let s3 = new AWS.S3();

// Adapted from http://stackoverflow.com/a/22210077/2601552
function uploadFile (buffer, fileName) {
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
}

module.exports = {
  uploadFile: uploadFile,
};

