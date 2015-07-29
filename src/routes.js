let express = require('express');
let router = express.Router();
let _ = require('lodash');

let webhook = require('./webhook');
let s3 = require('./s3');
let config = require('./config');

router.get('/', (req, res) => {
  res.send('(ಠ_ಠ)').status(200);
});

router.post('/webhook', (req, res) => {
  let isXHubValid = _checkXHub(req);

  if (isXHubValid) {
    let body = req.body;

    let branch = config.get('GITHUB_BRANCH_TO_WATCH');
    let files = _getFilesToUpload(body);

    let repoName = body.repository.full_name;
    let baseUrl = `https://raw.githubusercontent.com/${repoName}/${branch}/`;

    if (files) {
      _uploadFiles(files, baseUrl);
    }

    res.sendStatus(200);
  } else {
    res.sendStatus(403);
  }
});

var _getFilesToUpload = (body) => {
  let isCorrectBranch = webhook.verifyBranch(body.ref);

  if(isCorrectBranch) {
    return webhook.getWatchedFiles(body);
  }

  return false;
}

var _uploadFiles = (files, baseUrl) => {
  _(files).each((file) => {
    let fullUrl = `${baseUrl}${file}`;
    let fileName = _getFileName(file);
    s3.getFileFromUrlAndUpload(fullUrl, fileName);
  }).value();
}

var _getFileName = (file) => {
  let piecesOfPath = file.split('/');
  let name = _.last(piecesOfPath);
  let directory = config.get('S3_DIRECTORY');
  let fullName = directory + name;

  return fullName;
}

var _checkXHub = (req) => {
  return req.isXHub && req.isXHubValid();
}

module.exports = router;
