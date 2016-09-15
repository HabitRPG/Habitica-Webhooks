'use strict';

let github = require('../../src/lib/github');
let request = require('superagent');
global.Promise = require('bluebird');

describe('github', () => {
  afterEach(function () {
    sandbox.restore();
  });

  describe('getFiles', () => {
    beforeEach(function () {
      this.body = {
        commits: [
          { added: ['1-add-foo', 'add-duplicate'], modified: ['1-mod-foo', '1-mod-bar'] },
          { modified: ['2-mod-foo'], deleted: ['2-del-foo'] },
          { added: [] },
          { added: ['add-duplicate'] },
        ],
      };
    });

    it('returns an empty array when no files exist in commit', function () {
      let body = {
        commits: [
          { added: [] },
          { added: [] },
          { added: [] },
          { added: [] },
        ],
      };

      let files = github.getFiles(body);

      expect(files.added.length).to.eql(0);
      expect(files.modified.length).to.eql(0);
      expect(files.deleted.length).to.eql(0);
    });

    it('returns an array of files for each type', function () {
      let files = github.getFiles(this.body);

      expect(files.added).to.be.an('array');
      expect(files.added).to.have.a.lengthOf(2);
      expect(files.modified).to.be.an('array');
      expect(files.modified).to.have.a.lengthOf(3);
      expect(files.deleted).to.be.an('array');
      expect(files.deleted).to.have.a.lengthOf(1);
    });

    it('does not include duplicates', function () {
      let files = github.getFiles(this.body);

      expect(files.added).to.eql(['1-add-foo', 'add-duplicate']);
    });
  });

  describe('getFilesDiff', function () {
    beforeEach(function () {
      this.body = {
        before: 'e65f27fb69769e54405e2c3a798ec5b240ef2b7e',
        after: 'ebef5ad60c363af3d6ab571461f424a8791f7229',
        repository: {
          full_name: 'HabitRPG/habitrpg', // eslint-disable-line camelcase
        },
      };
    });

    it('returns the file information for the diff between a range of commits', function () {
      let fakeResponse = {
        body: {
          commits: [],
          files: [{
            sha: 'eb16d83db7802dadb45ffe6b78160473ede09804',
            filename: 'test/sanity/no-duplicate-translation-keys.js',
            status: 'added',
            additions: 27,
            deletions: 0,
            changes: 27,
            patch: '@@ -0,0 +1,27 @@\n+\'use strict\';\n+\n+let glob = require(\'glob\').sync;\n+\n+describe(\'Locales files\', () => {',
          }],
        },
      };
      sandbox.stub(request, 'get').returns(Promise.resolve(fakeResponse));
      return github.getFilesDiff(this.body).then((files) => {
        expect(files).to.eql(fakeResponse.body.files);
      });
    });
  });

  describe('getRepoName', function () {
    it('returns the full name from the webhook body', function () {
      let body = {
        repository: {
          full_name: 'foo/bar', // eslint-disable-line camelcase
        },
      };

      expect(github.getRepoName(body)).to.eql('foo/bar');
    });
  });
});
