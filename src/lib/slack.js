'use strict';

let SlackWebhook = require('slack-webhook');
let config = require('./config');

const SLACK_URL = config.get('SLACK_URL');

let slack = new SlackWebhook(SLACK_URL);

module.exports = slack;
