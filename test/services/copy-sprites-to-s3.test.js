'use strict';

let copySpritesToS3 = require('../../src/services/copy-sprites-to-s3');
let request = require('../../src/lib/request');
let s3 = require('../../src/lib/s3');
let Promise = require('bluebird');

const SPRITE_PATH = 'common/img/sprites/spritesmith/';
const GITHUB_URL_BASE = `https://raw.githubusercontent.com/habitrpg/habitrpg/develop/${SPRITE_PATH}`;

describe('copySpritesToS3', () => {
  beforeEach(function () {
    let commits = [
      { added: [`${SPRITE_PATH}1-add-foo`, `${SPRITE_PATH}add-duplicate`], modified: ['not-a-sprite', `${SPRITE_PATH}1-mod-bar`] },
      { modified: [`${SPRITE_PATH}2-mod-foo`], deleted: [`${SPRITE_PATH}2-del-foo`] },
      { added: ['not-a-added-sprite'], deleted: ['not-a-sprite'] },
      { added: [`${SPRITE_PATH}add-duplicate`] },
    ];

    this.body = {
      commits: commits,
      repository: {
        full_name: 'habitrpg/habitrpg', // eslint-disable-line camelcase
      },
    };

    sandbox.stub(request, 'getFileFromUrl').returns(Promise.resolve('a file'));
    sandbox.stub(s3, 'uploadFile').returns(Promise.resolve());
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('returns a promise', function () {
    let promise = copySpritesToS3(this.body);

    expect(promise).to.respondTo('then');
  });

  it('fetches file for each spritesmith image', function (done) {
    copySpritesToS3(this.body).then(() => {
      expect(request.getFileFromUrl).to.have.callCount(4);
      expect(request.getFileFromUrl).to.be.calledWith(`${GITHUB_URL_BASE}1-add-foo`);
      expect(request.getFileFromUrl).to.be.calledWith(`${GITHUB_URL_BASE}add-duplicate`);
      expect(request.getFileFromUrl).to.be.calledWith(`${GITHUB_URL_BASE}1-mod-bar`);
      expect(request.getFileFromUrl).to.be.calledWith(`${GITHUB_URL_BASE}2-mod-foo`);
      done();
    });
  });

  it('uploads files for each image fetched', function (done) {
    copySpritesToS3(this.body).then(() => {
      expect(s3.uploadFile).to.have.callCount(4);
      expect(s3.uploadFile).to.be.calledWith('a file', 'path/to/s3/1-add-foo');
      expect(s3.uploadFile).to.be.calledWith('a file', 'path/to/s3/add-duplicate');
      expect(s3.uploadFile).to.be.calledWith('a file', 'path/to/s3/1-mod-bar');
      expect(s3.uploadFile).to.be.calledWith('a file', 'path/to/s3/2-mod-foo');
      done();
    });
  });

  it('rejects if there are too many files', function (done) {
    this.body.commits = [];
    for (let i = 0; i < 30; i++) {
      this.body.commits.push({
        added: [
          `${SPRITE_PATH}${i}-add-foo`,
        ],
        modified: [
          `${SPRITE_PATH}${i}-mod-bar`,
        ],
      });
    }

    copySpritesToS3(this.body).then(done).catch((err) => {
      expect(err.message).to.eql('60 sprites detected. This exceeds the maximum files allowed for upload (50). You may need to upload sprites manually to S3');
      done();
    });
  });
});

