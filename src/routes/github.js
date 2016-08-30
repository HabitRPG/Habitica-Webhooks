'use strict';

let express = require('express');
let router = express.Router();
let Promise = require('bluebird');

let githubMiddleware = require('../middleware/github');
let checkXHub = githubMiddleware.checkXHub;
let checkGithubBranch = githubMiddleware.checkGithubBranch;
let slack = require('../lib/slack');
let github = require('../lib/github');

let copySpritesToS3 = require('../services/copy-sprites-to-s3');

function sendSpriteSuccessMessage (results) {
  let numberOfUploads = results.length;

  if (numberOfUploads === 0) return;

  let text = `*${numberOfUploads} sprites were uploaded succesfully:*`;
  let attachmentText = results.join('\n');

  slack.send({
    text: text,
    attachments: [{
      color: 'good',
      text: attachmentText,
    }],
  });
}

router.post('/habitrpg', checkXHub, checkGithubBranch, (req, res) => {
  let body = req.body;
  let files = github.getFiles(body);
  let repoName = github.getRepoName(body);

  Promise.all([
    copySpritesToS3(files, repoName).then(sendSpriteSuccessMessage),
  ]).catch((err) => {
    slack.reportError('*Uh oh. Something went wrong in the POST /github/habitrpg route*', err);
  });

  res.sendStatus(200);
});

module.exports = router;
