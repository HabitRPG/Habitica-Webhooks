'use strict';

let copySpritesToS3 = require('../../src/services/copy-sprites-to-s3');
let request = require('../../src/lib/request');
let s3 = require('../../src/lib/s3');
let github = require('../../src/lib/github');
global.Promise = require('bluebird');

const SPRITE_PATH = 'website/assets/sprites/spritesmith/';
const GITHUB_URL_BASE = `https://raw.githubusercontent.com/habitrpg/habitica/develop/${SPRITE_PATH}`;

describe('copySpritesToS3', () => {
  beforeEach(function () {
    sandbox.stub(github, 'getRepoName').returns('habitrpg/habitica');
    sandbox.stub(github, 'getFiles').returns({
      added: [
        `${SPRITE_PATH}1-add-foo`,
        `${SPRITE_PATH}add-duplicate`,
        'not-an-added-sprite',
      ],
      modified: [
        'not-a-sprite',
        `${SPRITE_PATH}1-mod-bar`,
        `${SPRITE_PATH}2-mod-foo`,
      ],
      deleted: [`${SPRITE_PATH}2-del-foo`, 'not-a-sprite'],
    });

    sandbox.stub(request, 'getFileFromUrl').returns(Promise.resolve('a file'));
    sandbox.stub(s3, 'uploadFile').returns(Promise.resolve());
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('returns a promise', function () {
    let promise = copySpritesToS3({ /* webhook body */ });

    expect(promise).to.respondTo('then');
  });

  it('fetches file for each spritesmith image', function (done) {
    copySpritesToS3({ /* webhook body */ }).then(() => {
      expect(request.getFileFromUrl).to.have.callCount(4);
      expect(request.getFileFromUrl).to.be.calledWith(`${GITHUB_URL_BASE}1-add-foo`);
      expect(request.getFileFromUrl).to.be.calledWith(`${GITHUB_URL_BASE}add-duplicate`);
      expect(request.getFileFromUrl).to.be.calledWith(`${GITHUB_URL_BASE}1-mod-bar`);
      expect(request.getFileFromUrl).to.be.calledWith(`${GITHUB_URL_BASE}2-mod-foo`);
      done();
    });
  });

  it('uploads files for each image fetched', function (done) {
    copySpritesToS3({ /* webhook body */ }).then(() => {
      expect(s3.uploadFile).to.have.callCount(4);
      expect(s3.uploadFile).to.be.calledWith('a file', 'path/to/s3/1-add-foo');
      expect(s3.uploadFile).to.be.calledWith('a file', 'path/to/s3/add-duplicate');
      expect(s3.uploadFile).to.be.calledWith('a file', 'path/to/s3/1-mod-bar');
      expect(s3.uploadFile).to.be.calledWith('a file', 'path/to/s3/2-mod-foo');
      done();
    });
  });

  it('rejects if there are too many files', function (done) {
    let files = { added: [], modified: [] };
    for (let i = 0; i < 30; i++) {
      files.added.push(`${SPRITE_PATH}${i}-add-foo`);
      files.modified.push(`${SPRITE_PATH}${i}-mod-bar`);
    }

    github.getFiles.returns(files);

    copySpritesToS3({ /* webhook body */ }).then(done).catch((err) => {
      expect(err.message).to.eql('60 sprites detected. This exceeds the maximum files allowed for upload (50). You may need to upload sprites manually to S3');
      done();
    });
  });
});

