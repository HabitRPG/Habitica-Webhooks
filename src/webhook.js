let config = require('./config');
let _ = require('lodash');

let getWatchedFiles = (body) => {
  let newFiles = _getNewFiles(body.commits);
  let watchedFiles = _filterOutUnwatchedFiles(newFiles);

  return watchedFiles;
}

var verifyBranch = (ref) => {
  let branchToCheck = config.get('GITHUB_BRANCH_TO_WATCH');
  let refToCheck = `refs/heads/${branchToCheck}`;

  return ref === refToCheck;
}

var _getNewFiles = (commits) => {
  let addedFiles = _.pluck(commits, 'added');
  let modifiedFiles = _.pluck(commits, 'modified');

  let flattenedFiles = _.flattenDeep([addedFiles, modifiedFiles]);
  let uniqFiles = _.uniq(flattenedFiles);

  return uniqFiles;
}

var _filterOutUnwatchedFiles = (files) => {
  let watchedDirectories = JSON.parse(config.get('GITHUB_WATCHED_DIRECTORIES'));

  let watchedFiles = _(watchedDirectories).map((path) => {
    let contains = _.filter(files, (file) => {
      return _.startsWith(file, path);
    });

    return contains;
  }).value();


  let flattenedFiles = _.flattenDeep(watchedFiles);

  return flattenedFiles;
};

module.exports = {
  getWatchedFiles: getWatchedFiles,
  verifyBranch: verifyBranch
}
