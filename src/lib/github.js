'use strict';

let config = require('./config');
let _ = require('lodash');

function getFiles (commits, type) {
  let files = _(commits).pluck(type).flattenDeep().uniq().filter().value();

  return files;
}

function getNewFiles (commits) {
  let addedFiles = getFiles(commits, 'added');
  let modifiedFiles = getFiles(commits, 'modified');

  let flattenedFiles = _.flattenDeep([addedFiles, modifiedFiles]);
  let uniqFiles = _.uniq(flattenedFiles);

  return uniqFiles;
}

function filterOutUnwatchedFiles (files) {
  let watchedDirectories = JSON.parse(config.get('GITHUB_WATCHED_DIRECTORIES'));

  let watchedFiles = _(watchedDirectories).map((path) => {
    let contains = _.filter(files, (file) => {
      return _.startsWith(file, path);
    });

    return contains;
  }).value();


  let flattenedFiles = _.flattenDeep(watchedFiles);

  return flattenedFiles;
}

function getWatchedFiles (body) {
  let newFiles = getNewFiles(body.commits);
  let watchedFiles = filterOutUnwatchedFiles(newFiles);

  return watchedFiles;
}

module.exports = {
  getFiles: getFiles,
  getWatchedFiles: getWatchedFiles,
};
