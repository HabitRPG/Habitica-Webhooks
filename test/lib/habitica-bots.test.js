'use strict';

let HabiticaBot = require('../../src/lib/habitica-bots').HabiticaBot;
let gryponBot = require('../../src/lib/habitica-bots').gryphonBot;
let config = require('../../src/lib/config');

describe('habiticaBots', () => {
  describe('HabiticaBot', () => {
    it('creates a new habitica bot with creds', () => {
      let bot = new HabiticaBot({
        id: 'some-uuid',
        apiToken: 'some-token',
      });

      expect(bot.api.getOptions().id).to.eql('some-uuid');
      expect(bot.api.getOptions().apiToken).to.eql('some-token');
    });

    it('can send a chat message', () => {
      let bot = new HabiticaBot({
        id: 'some-uuid',
        apiToken: 'some-token',
      });

      sandbox.stub(bot.api, 'post');

      bot.sendChat('group-id', 'my message');

      expect(bot.api.post).to.be.calledOnce;
      expect(bot.api.post).to.be.calledWith('/groups/group-id/chat', {
        message: 'my message',
      });
    });
  });

  describe('gryphonBot', () => {
    it('is a preconfigured HabiticaBot', () => {
      expect(gryponBot).to.be.an.instanceof(HabiticaBot);
      expect(gryponBot.api.getOptions().id).to.eql(config.get('HABITICA_BOTS:GRYPHON_BOT:UUID'));
      expect(gryponBot.api.getOptions().apiToken).to.eql(config.get('HABITICA_BOTS:GRYPHON_BOT:API_TOKEN'));
    });
  });
});
