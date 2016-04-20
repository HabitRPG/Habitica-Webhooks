'use strict';

let express = require('express');
let router = express.Router();
let Promise = require('bluebird');

let githubMiddleware = require('../middleware/github');
let checkXHub = githubMiddleware.checkXHub;
let checkGithubBranch = githubMiddleware.checkGithubBranch;
let slack = require('../lib/slack');

let copySpritesToS3 = require('../services/copy-sprites-to-s3');

function sendSpriteSuccessMessage (results) {
  let numberOfUploads = results.length;
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

function reportError (err) {
  slack.send({
    text: '*Uh oh. Something went wrong in the POST /github/habitrpg route*',
    attachments: [{
      color: 'danger',
      text: err.toString(),
    }],
  });
}

router.post('/habitrpg', checkXHub, checkGithubBranch, (req, res) => {
  let body = req.body;

  Promise.all([
    copySpritesToS3(body).then(sendSpriteSuccessMessage),
  ]).catch(reportError);

  res.sendStatus(200);
});

module.exports = router;
