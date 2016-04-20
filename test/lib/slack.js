'use strict';

let slack = require('../../src/lib/slack');
let SlackWebhook = require('slack-webhook');

describe('slack', () => {
  it('exports an instnace of SlackWebhook', function () {
    expect(slack).to.be.an.instanceof(SlackWebhook);
  });
});
