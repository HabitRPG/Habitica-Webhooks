'use strict';

let gryphonBot = require('../lib/habitica-bots').gryphonBot;
global.Promise = require('bluebird');

const HELP_WANTED_LABEL = 'help wanted';
const TRUNCATE_WORD_COUNT = 80;

// Strip some unwanted markdown from the issue description.
// Because of truncating we also have to strip markdown emphasis
// (otherwise the emphasis could leak out if we cut in the middle)
function stripMarkdown (str) {
  return (
    str
      // Remove code blocks
      .replace(/```([.\s\S]*?)```/gm, '')
      // Remove images
      .replace(/\!\[(.*?)\][\[\(].*?[\]\)]/g, '')
      // Strip emphasis
      .replace(/([\*_`]{1,3})(\S.*?\S{0,1})\1/g, '$2')
  );
}

function truncate (str) {
  const words = stripMarkdown(str).split(' ');

  return (
    words.slice(0, TRUNCATE_WORD_COUNT).join(' ') +
    (words.length > TRUNCATE_WORD_COUNT ? '...' : '')
  );
}

function sendIssueInfoToHabitica (body, groupId) {
  // @see https://developer.github.com/v3/activity/events/types/#issuesevent for more details about the incoming data
  if (
    !body.action ||
    body.action !== 'labeled' ||
    !body.label ||
    body.label.name !== HELP_WANTED_LABEL ||
    !body.issue
  ) {
    // nothing to report, only interested in "help wanted" labels being added
    return Promise.resolve();
  }

  const message = `## :octocat: Help wanted

GitHub issue [#${body.issue.number}](${body.issue.html_url}) labeled with \`help wanted\`

*Title:* **${body.issue.title}**

*Description:*

${truncate(body.issue.body)}


*Read more in GitHub. Also questions and comments about the issue should be posted in GitHub.*

${body.issue.html_url}
`;

  return gryphonBot.sendChat(groupId, message);
}

module.exports = sendIssueInfoToHabitica;
