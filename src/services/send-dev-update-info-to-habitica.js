'use strict';

let github = require('../lib/github');
let gryphonBot = require('../lib/habitica-bots').gryphonBot;
global.Promise = require('bluebird');

const VERSTION_REGEX = /"version": "[0-9\.]*"/;
const PATCH_MARKER_REGEX = /@@.*@@/g;

function sendDevUpdateInfoToHabitica (body, groupId) {
  let modifiedFiles = github.getFiles(body).modified;
  let message = '';

  let packageJsonChanges = modifiedFiles.indexOf('package.json') > -1;
  let configJsonChanges = modifiedFiles.indexOf('config.json.example') > -1;

  if (!packageJsonChanges && !configJsonChanges) {
    // no changes to report
    return Promise.resolve();
  }

  return github.getFilesDiff(body).then((files) => {
    if (packageJsonChanges) {
      let pkgJson = files.find(file => file.filename === 'package.json');

      // We ignore changes to the package.json which are just version bumps
      if (pkgJson && (!VERSTION_REGEX.test(pkgJson.patch) || pkgJson.patch.match(PATCH_MARKER_REGEX).length > 1)) {
        message += `The package.json file was recently modified. You _may_ need to re-install your node_modules. Here's what changed:

\`\`\`diff
${pkgJson.patch}
\`\`\`
`;
      }
    }

    if (configJsonChanges) {
      let configJson = files.find(file => file.filename === 'config.json.example');

      if (configJson) {
        message += `The config.json.example file was recently modified. You _may_ need to update your config.json. Here's what changed:

\`\`\`diff
${configJson.patch}
\`\`\`
`;
      }
    }

    if (!message) {
      return Promise.resolve();
    }

    return gryphonBot.sendChat(groupId, message);
  });
}

module.exports = sendDevUpdateInfoToHabitica;
