'use strict';

let express = require('express');
let router = express.Router();
global.Promise = require('bluebird');

let githubMiddleware = require('../middleware/github');
let checkXHub = githubMiddleware.checkXHub;
let checkGithubBranch = githubMiddleware.checkGithubBranch;
let slack = require('../lib/slack');
let config = require('../lib/config');

let copySpritesToS3 = require('../services/copy-sprites-to-s3');
let sendDevUpdateInfoToHabitica = require('../services/send-dev-update-info-to-habitica');

const DEV_UPDATES_GROUP_ID = config.get('HABITICA:GROUPS:UPDATE_DEVS');

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

  res.sendStatus(200);

  Promise.all([
    copySpritesToS3(body).then(sendSpriteSuccessMessage),
    sendDevUpdateInfoToHabitica(body, DEV_UPDATES_GROUP_ID),
  ]).catch((err) => {
    slack.reportError('*Uh oh. Something went wrong in the POST /github/habitrpg route*', err);
  });
});

module.exports = router;
