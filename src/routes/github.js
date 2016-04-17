'use strict';

let express = require('express');
let router = express.Router();

let githubMiddleware = require('../middleware/github');
let checkXHub = githubMiddleware.checkXHub;
let checkGithubBranch = githubMiddleware.checkGithubBranch;

let copySpritesToS3 = require('../services/copy-sprites-to-s3');

router.post('/habitrpg', checkXHub, checkGithubBranch, (req, res) => {
  let body = req.body;

  copySpritesToS3(body);

  res.sendStatus(200);
});

module.exports = router;
