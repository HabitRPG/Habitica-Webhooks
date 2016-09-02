'use strict';

let sendDevUpdateInfoToHabitica = require('../../src/services/send-dev-update-info-to-habitica');
let github = require('../../src/lib/github');
let gryphonBot = require('../../src/lib/habitica-bots').gryphonBot;
let Promise = require('bluebird');

describe('sendDevUpdateInfoToHabitica', function () {
  beforeEach(function () {
    sandbox.stub(gryphonBot, 'sendChat').returns(Promise.resolve());
    sandbox.stub(github, 'getFiles');
    sandbox.stub(github, 'getFilesDiff');
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('sends package.json changes to habitica', function () {
    github.getFiles.returns({modified: ['package.json']});
    github.getFilesDiff.returns(Promise.resolve([{
      filename: 'package.json',
      patch: '-    "nock": "^2.17.0",',
    }]));
    return sendDevUpdateInfoToHabitica({ /* webhook body */ }, 'group-id').then(() => {
      expect(gryphonBot.sendChat).to.be.calledOnce;
      expect(gryphonBot.sendChat).to.be.calledWith('group-id', 'The package.json file was recently modified. You _may_ need to re-install your node_modules. Here\'s what changed:\n\n```diff\n-    "nock": "^2.17.0",\n```\n');
    });
  });

  it('ignores package.json changes that are version bumps', function () {
    github.getFiles.returns({modified: ['package.json']});
    github.getFilesDiff.returns(Promise.resolve([{
      filename: 'package.json',
      patch: '+-    "version": "3.31.0",-    "version": "^3.30.2",',
    }]));
    return sendDevUpdateInfoToHabitica({ /* webhook body */ }, 'group-id').then(() => {
      expect(gryphonBot.sendChat).to.not.be.called;
    });
  });

  it('sends config.json.example changes to habitica', function () {
    github.getFiles.returns({modified: ['config.json.example']});
    github.getFilesDiff.returns(Promise.resolve([{
      filename: 'config.json.example',
      patch: '+    "FACEBOOK_ANALYTICS":"1234567890123456",',
    }]));
    return sendDevUpdateInfoToHabitica({ /* webhook body */ }, 'group-id').then(() => {
      expect(gryphonBot.sendChat).to.be.calledOnce;
      expect(gryphonBot.sendChat).to.be.calledWith('group-id', 'The config.json.example file was recently modified. You _may_ need to update your config.json. Here\'s what changed:\n\n```diff\n+    "FACEBOOK_ANALYTICS":"1234567890123456",\n```\n');
    });
  });

  it('sends a message about both package.json and config.json.example', function () {
    github.getFiles.returns({modified: ['package.json', 'config.json.example']});
    github.getFilesDiff.returns(Promise.resolve([{
      filename: 'package.json',
      patch: '-    "nock": "^2.17.0",',
    }, {
      filename: 'config.json.example',
      patch: '+    "FACEBOOK_ANALYTICS":"1234567890123456",',
    }]));
    return sendDevUpdateInfoToHabitica({ /* webhook body */ }, 'group-id').then(() => {
      expect(gryphonBot.sendChat).to.be.calledOnce;
      expect(gryphonBot.sendChat).to.be.calledWith('group-id', 'The package.json file was recently modified. You _may_ need to re-install your node_modules. Here\'s what changed:\n\n```diff\n-    "nock": "^2.17.0",\n```\nThe config.json.example file was recently modified. You _may_ need to update your config.json. Here\'s what changed:\n\n```diff\n+    "FACEBOOK_ANALYTICS":"1234567890123456",\n```\n');
    });
  });
});
