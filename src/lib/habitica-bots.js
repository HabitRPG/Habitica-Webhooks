'use strict';

const config = require('./config');
const Habitica = require('habitica');

function HabiticaBot (creds) {
  this.api = new Habitica(creds);
}

HabiticaBot.prototype.sendChat = function sendChat (groupId, msgText) {
  return this.api.post(`/groups/${groupId}/chat`, {
    message: msgText,
  });
};

const gryphonBot = new HabiticaBot({
  id: config.get('HABITICA_BOTS:GRYPHON_BOT:UUID'),
  apiToken: config.get('HABITICA_BOTS:GRYPHON_BOT:API_TOKEN'),
  platform: 'Habitica Webhooks',
});

module.exports = {
  HabiticaBot: HabiticaBot,
  gryphonBot: gryphonBot,
};
