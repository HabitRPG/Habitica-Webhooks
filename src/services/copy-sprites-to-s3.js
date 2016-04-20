'use strict';

let _ = require('lodash');
let Promise = require('bluebird');
let github = require('../lib/github');
let s3 = require('../lib/s3');
let request = require('../lib/request');
let config = require('../lib/config');

const DIRECTORIES_WITH_SPRITES = [
  'common/img/sprites/spritesmith',
];
const S3_DIRECTORY = config.get('S3_SPRITES_DIRECTORY');
const GITHUB_BRANCH = config.get('GITHUB_BRANCH_TO_WATCH') || 'develop';

function getFilesToUpload (commits) {
  let addedFiles = github.getFiles(commits, 'added');
  let modifiedFiles = github.getFiles(commits, 'modified');
  let combinedFiles = _([addedFiles, modifiedFiles]).flattenDeep().uniq().value();

  let files = DIRECTORIES_WITH_SPRITES.map((path) => {
    return combinedFiles.filter(file => _.startsWith(file, path));
  });

  let flattenedFiles = _.flattenDeep(files);

  return flattenedFiles;
}

function getFileName (file) {
  let piecesOfPath = file.split('/');
  let name = _.last(piecesOfPath);
  let fullName = S3_DIRECTORY + name;

  return fullName;
}

function uploadFiles (files, baseUrl) {
  let uploadPromises = files.map((file) => {
    let fullUrl = `${baseUrl}${file}`;
    let fileName = getFileName(file);

    return request.getFileFromUrl(fullUrl).then((buffer) => {
      return s3.uploadFile(buffer, fileName);
    });
  });

  return uploadPromises;
}

function copySpritesToS3 (body) {
  let files = getFilesToUpload(body.commits);

  let repoName = body.repository.full_name;
  let baseUrl = `https://raw.githubusercontent.com/${repoName}/${GITHUB_BRANCH}/`;

  return Promise.all(uploadFiles(files, baseUrl));
}

module.exports = copySpritesToS3;
