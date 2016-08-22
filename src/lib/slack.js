'use strict';

let SlackWebhook = require('slack-webhook');
let config = require('./config');

const SLACK_URL = config.get('SLACK_URL');

let slack = new SlackWebhook(SLACK_URL);

function send (options) {
  slack.send(options);
}

function reportError (text, err) {
  slack.send({
    text: text,
    attachments: [{
      color: 'danger',
      text: err.toString(),
    }],
  });
}

module.exports = {
  send: send,
  reportError: reportError,
};
