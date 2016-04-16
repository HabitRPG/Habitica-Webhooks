'use strict';

let express = require('express');
let router = express.Router();
let _ = require('lodash');

let githubMiddleware = require('../middleware/github');
let checkXHub = githubMiddleware.checkXHub;
let checkGithubBranch = githubMiddleware.checkGithubBranch;

let github = require('../lib/github');
let s3 = require('../lib/s3');
let config = require('../lib/config');

router.get('/', (req, res) => {
  res.send('(ಠ_ಠ)').status(200);
});

let _getFileName = (file) => {
  let piecesOfPath = file.split('/');
  let name = _.last(piecesOfPath);
  let directory = config.get('S3_DIRECTORY');
  let fullName = directory + name;

  return fullName;
};


let _uploadFiles = (files, baseUrl) => {
  _(files).each((file) => {
    let fullUrl = `${baseUrl}${file}`;
    let fileName = _getFileName(file);
    s3.getFileFromUrlAndUpload(fullUrl, fileName);
  }).value();
};

router.post('/webhook', checkXHub, checkGithubBranch, (req, res) => {
  let body = req.body;

  let files = github.getWatchedFiles(body);
  let branch = config.get('GITHUB_BRANCH_TO_WATCH');
  let repoName = body.repository.full_name;
  let baseUrl = `https://raw.githubusercontent.com/${repoName}/${branch}/`;

  _uploadFiles(files, baseUrl);

  res.sendStatus(200);
});

module.exports = router;
