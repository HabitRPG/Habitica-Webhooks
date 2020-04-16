'use strict';

let sendIssueInfoToHabitica = require('../../src/services/send-issue-info-to-habitica');
let gryphonBot = require('../../src/lib/habitica-bots').gryphonBot;
global.Promise = require('bluebird');

const getMessage = (body, truncatedIssueBody) => `## :octocat: Help wanted

GitHub issue [#${body.issue.number}](${body.issue.html_url}) labeled with \`help wanted\`

*Title:* **${body.issue.title}**

*Description:*

${truncatedIssueBody || body.issue.body}


*Read more in GitHub. Also questions and comments about the issue should be posted in GitHub.*

${body.issue.html_url}
`;

describe('sendIssueInfoToHabitica', function () {
  let webhookBody;

  beforeEach(function () {
    sandbox.stub(gryphonBot, 'sendChat').returns(Promise.resolve());

    /* eslint-disable camelcase */
    webhookBody = {
      action: 'labeled',
      label: {
        name: 'help wanted',
      },
      issue: {
        number: 1,
        html_url: 'https://github.com/HabitRPG/habitica/issues/1',
        title: 'Issue Title',
        body: 'Test issue body',
      },
    };
    /* eslint-enable */
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('ignores unrelated actions', function () {
    webhookBody.action = 'unlabeled';

    return sendIssueInfoToHabitica(webhookBody, 'group-id').then(() => {
      expect(gryphonBot.sendChat).to.not.be.called;
    });
  });

  it('ignores unrelated labels', function () {
    webhookBody.label.name = 'some label';

    return sendIssueInfoToHabitica(webhookBody, 'group-id').then(() => {
      expect(gryphonBot.sendChat).to.not.be.called;
    });
  });

  it('sends issue notification to habitica', function () {
    return sendIssueInfoToHabitica(webhookBody, 'group-id').then(() => {
      expect(gryphonBot.sendChat).to.be.calledOnce;
      expect(gryphonBot.sendChat).to.be.calledWith('group-id', getMessage(webhookBody));
    });
  });

  it('truncates issue body before sending to habitica', function () {
    const maxWords = 'word '.repeat(80).trim();
    webhookBody.issue.body = `${maxWords} extra`;

    return sendIssueInfoToHabitica(webhookBody, 'group-id').then(() => {
      expect(gryphonBot.sendChat).to.be.calledOnce;
      expect(gryphonBot.sendChat).to.be.calledWith('group-id', getMessage(webhookBody, `${maxWords}...`));
    });
  });

  it('strips markdown from issue body before sending to habitica', function () {
    webhookBody.issue.body = 'Hello\n```\ncode block\n```\n\n![image](url)\n\n**bold** _italic_ `code`';
    const expectedBody = 'Hello\n\n\n\n\nbold italic code';

    return sendIssueInfoToHabitica(webhookBody, 'group-id').then(() => {
      expect(gryphonBot.sendChat).to.be.calledOnce;
      expect(gryphonBot.sendChat).to.be.calledWith('group-id', getMessage(webhookBody, expectedBody));
    });
  });
});
