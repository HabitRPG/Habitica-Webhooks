'use strict';

let HabiticaBot = require('../../src/lib/habitica-bots').HabiticaBot;
let gryponBot = require('../../src/lib/habitica-bots').gryphonBot;
let config = require('../../src/lib/config');

describe('habiticaBots', () => {
  describe('HabiticaBot', () => {
    it('creates a new habitica bot with creds', () => {
      let bot = new HabiticaBot({
        uuid: 'some-uuid',
        token: 'some-token',
      });

      expect(bot.api.getUuid()).to.eql('some-uuid');
      expect(bot.api.getToken()).to.eql('some-token');
    });

    it('can send a chat message', () => {
      let bot = new HabiticaBot({
        uuid: 'some-uuid',
        token: 'some-token',
      });

      sandbox.stub(bot.api.chat, 'post');

      bot.sendChat('group-id', 'my message');

      expect(bot.api.chat.post).to.be.calledOnce;
      expect(bot.api.chat.post).to.be.calledWith('group-id', {
        message: 'my message',
      });
    });
  });

  describe('gryphonBot', () => {
    it('is a preconfigured HabiticaBot', () => {
      expect(gryponBot).to.be.an.instanceof(HabiticaBot);
      expect(gryponBot.api.getUuid()).to.eql(config.get('HABITICA_BOTS:GRYPHON_BOT:UUID'));
      expect(gryponBot.api.getToken()).to.eql(config.get('HABITICA_BOTS:GRYPHON_BOT:API_TOKEN'));
    });
  });
});
