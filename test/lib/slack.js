'use strict';

let slack = require('../../src/lib/slack');
let SlackWebhook = require('slack-webhook');

describe('slack', () => {
  beforeEach(() => {
    sandbox.stub(SlackWebhook.prototype, 'send');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('send', () => {
    it('calls SlackWebhook.prototype.send', () => {
      let options = { foo: 'bar' };
      slack.send(options);

      expect(SlackWebhook.prototype.send).to.be.calledOnce;
      expect(SlackWebhook.prototype.send).to.be.calledWith(options);
    });
  });

  describe('reportError', () => {
    it('calls send with formatted error', () => {
      let err = new Error('Something went wrong');
      slack.reportError('custom text', err);

      expect(SlackWebhook.prototype.send).to.be.calledOnce;
      expect(SlackWebhook.prototype.send).to.be.calledWith({
        text: 'custom text',
        attachments: [{
          color: 'danger',
          text: 'Error: Something went wrong',
        }],
      });
    });
  });
});
