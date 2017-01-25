'use strict';

let _ = require('lodash');
let request = require('superagent');

const COMMIT_TYPES = Object.freeze(['added', 'modified', 'deleted']);

/**
 * Extracts added, modified and deleted files from a GitHub webhook body
 *
 * @param  webhookBody  The body of the Github Webhook
 *
 * @return Object The files in the commit. Each property is an array. Includes added, modified and deleted properties.
 */
function getFiles (webhookBody) {
  let commits = webhookBody.commits;
  let emptySets = COMMIT_TYPES.reduce((set, type) => {
    set[type] = [];
    return set;
  }, {});

  let files = _(commits).reduce((result, commit) => {
    COMMIT_TYPES.forEach((type) => {
      let filesOfType = commit[type];

      if (filesOfType) {
        result[type].push.apply(result[type], filesOfType); // eslint-disable-line prefer-spread
      }
    });

    return result;
  }, emptySets);

  COMMIT_TYPES.forEach((type) => {
    files[type] = _.uniq(files[type]);
  });

  return files;
}

/**
 * Extracts the repository name from the GitHub webhook body
 *
 * @param  webhookBody  The body of the Github Webhook
 *
 * @return String The full name of the repository
 */
function getRepoName (webhookBody) {
  return webhookBody.repository.full_name;
}

/**
 * Gets the patch files for a commit and file
 *
 * @param  webhookBody  The body of the Github Webhook
 *
 * @return Promise A promise that resolves an array of files
 */
function getFilesDiff (webhookBody) {
  let before = webhookBody.before;
  let after = webhookBody.after;
  let repoName = getRepoName(webhookBody);

  return request.get(`https://api.github.com/repos/${repoName}/compare/${before}...${after}`).then((res) => {
    return res.body.files;
  });
}


module.exports = {
  getFiles,
  getFilesDiff,
  getRepoName,
};
