'use strict';

let _ = require('lodash');

const COMMIT_TYPES = Object.freeze(['added', 'modified', 'deleted']);

/**
 * Extracts added, modified and deleted files from GitHub webhook body
 *
 * @param  webhookBody  The body of the Github Webhook

 * @return files The files in the commit
 * @return files.added The files that have been added
 * @return files.modified The files that have been modified
 * @return files.deleted The files that have been deleted
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

 * @return fullName The full name of the repository
 */
function getRepoName (webhookBody) {
  return webhookBody.repository.full_name;
}

module.exports = {
  getFiles: getFiles,
  getRepoName: getRepoName,
};
