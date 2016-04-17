'use strict';

let express = require('express');
let router = express.Router();
let Promise = require('bluebird');

let githubMiddleware = require('../middleware/github');
let checkXHub = githubMiddleware.checkXHub;
let checkGithubBranch = githubMiddleware.checkGithubBranch;

let copySpritesToS3 = require('../services/copy-sprites-to-s3');

router.post('/habitrpg', checkXHub, checkGithubBranch, (req, res) => {
  let body = req.body;

  Promise.all([
    copySpritesToS3(body),
  ]).catch((error) => {
    // TODO: Report error in slack
    console.error(error);
  });

  res.sendStatus(200);
});

module.exports = router;
