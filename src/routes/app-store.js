'use strict';

let express = require('express');
let router = express.Router();
// let Promise = require('bluebird');
//
let slack = require('../lib/slack');

function getRatingColor (rating) {
  if (rating < 3) {
    return 'danger';
  } else if (rating < 4) {
    return 'warning';
  } else if (rating <= 5) {
    return 'good';
  }
}

function getRatingStars (rating) {
  let stars = '';

  for (let i = 0; i < 5; i++) {
    if (i <= rating) {
      stars += '★';
    } else {
      stars += '✩';
    }
  }

  return stars;
}

function getBotData (platform) {
  if (platform === 'iOS') {
    return {
      emoji: ':app_store:',
      name: 'iOS App Store',
      appIcon: 'http://a5.mzstatic.com/us/r30/Purple22/v4/a5/f7/d8/a5f7d873-d52e-2238-f9af-2c00804fcb7f/icon175x175.png',
    };
  } else if (platform === 'android') {
    return {
      emoji: ':google_play_store:',
      name: 'Google Play Store',
      appIcon: 'https://lh3.googleusercontent.com/8OCsGkPqZe2EgKsbF8o8ew9rhv0EeL8X77AtIrNctXA0x8Zj65OdRebDwIoqpGDqnw4=w300-rw',
    };
  }

  return {};
}

function getContent (body) {
  return `${body.content}

_by <${body.authorUri}|${body.author}> for v${body.version}_ · <${body.permalink}|Permalink>`;
}

router.post('/reviews', (req, res) => {
  let body = req.body;
  let color = getRatingColor(body.rating);
  let bot = getBotData(body.platform);

  /* eslint-disable camelcase */
  slack.send({
    icon_emoji: bot.emoji,
    username: bot.name,
    // channel: 'auto-mobile-reviews',
    attachments: [{
      fallback: 'iOS Review',
      color: color,
      author_name: getRatingStars(body.rating),
      author_icon: bot.appIcon,
      title: body.title,
      title_link: body.permalink,
      text: getContent(body),
      mrkdwn_in: [
        'text',
      ],
    }],
    /* eslint-enable */
  });

  res.sendStatus(200);
});

module.exports = router;
