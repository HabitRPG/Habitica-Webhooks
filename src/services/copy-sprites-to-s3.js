'use strict';

let _ = require('lodash');
global.Promise = require('bluebird');
let s3 = require('../lib/s3');
let request = require('../lib/request');
let config = require('../lib/config');
let github = require('../lib/github');

const DIRECTORIES_WITH_SPRITES = [
  'website/assets/sprites/spritesmith',
];
const S3_DIRECTORY = config.get('S3_SPRITES_DIRECTORY');
const GITHUB_BRANCH = config.get('GITHUB_BRANCH_TO_WATCH') || 'develop';
const MAX_FILES_TO_PARSE = 500;
const MAX_FILES_TO_UPLOAD = 50;

function getFilesToUpload (githubFiles) {
  let combinedFiles = _([githubFiles.added, githubFiles.modified]).flattenDeep().uniq().value();

  if (combinedFiles.length > MAX_FILES_TO_PARSE) {
    return new Error(`${combinedFiles.length} files to parse detected. This exceeds the maximum files allowed for parsing when uploading to S3 (${MAX_FILES_TO_PARSE}). You may need to upload sprites manually to S3`);
  }

  let files = DIRECTORIES_WITH_SPRITES.map((path) => {
    return combinedFiles.filter(file => _.startsWith(file, path));
  });

  let flattenedFiles = _.flattenDeep(files);

  if (flattenedFiles.length > MAX_FILES_TO_UPLOAD) {
    return new Error(`${flattenedFiles.length} sprites detected. This exceeds the maximum files allowed for upload (${MAX_FILES_TO_UPLOAD}). You may need to upload sprites manually to S3`);
  }

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
  let githubFiles = github.getFiles(body);
  let repoName = github.getRepoName(body);
  let files = getFilesToUpload(githubFiles);

  if (files instanceof Error) {
    return Promise.reject(files);
  }

  let baseUrl = `https://raw.githubusercontent.com/${repoName}/${GITHUB_BRANCH}/`;

  return Promise.all(uploadFiles(files, baseUrl));
}

module.exports = copySpritesToS3;
