'use strict';

const config = require('./config');
const Habitica = require('habitica');

function HabiticaBot (creds) {
  this.api = new Habitica(creds);
}

HabiticaBot.prototype.sendChat = function sendChat (groupId, msgText) {
  return this.api.chat.post(groupId, {
    message: msgText,
  });
};

const gryphonBot = new HabiticaBot({
  uuid: config.get('HABITICA_BOTS:GRYPHON_BOT:UUID'),
  token: config.get('HABITICA_BOTS:GRYPHON_BOT:API_TOKEN'),
});

module.exports = {
  HabiticaBot: HabiticaBot,
  gryphonBot: gryphonBot,
};
