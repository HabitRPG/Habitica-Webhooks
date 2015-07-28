let express = require('express');
let router = express.Router();

let webhook = require('./webhook');
let s3 = require('./s3');

router.get('/', (req, res, next) => {
  res.send('(ಠ_ಠ)').status(200);
});

router.post('/webhook', (req, res, next) => {
  let isXHub = req.isXHub;
  let isXHubValid = req.isXHubValid();

  if (isXHub && isXHubValid) {
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

  return name;
}

module.exports = router;
