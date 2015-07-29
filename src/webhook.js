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
  let watchedDirectories = config.get('GITHUB_WATCHED_DIRECTORIES');
  console.log("DIRECTORIES TO WATCH");
  console.log(watchedDirectories);
  console.log("*************************");

  let watchedFiles = _(watchedDirectories).map((path) => {
    let contains = _.filter(files, (file) => {
      return _.startsWith(file, path);
    });

    console.log("CONTAINS");
    console.log(contains);
  console.log("*************************");
    return contains;
  }).value();

  console.log("WATCHED FILES");
  console.log(watchedFiles);
  console.log("*************************");

  let flattenedFiles = _.flattenDeep(watchedFiles);
  console.log("FLATTEND");
  console.log(flattenedFiles);

  return flattenedFiles;
};

module.exports = {
  getWatchedFiles: getWatchedFiles,
  verifyBranch: verifyBranch
}
