'use strict';

let github = require('../../src/lib/github');

describe('github', () => {
  describe('getFiles', () => {
    beforeEach(function () {
      this.commits = [
        { added: ['1-add-foo', 'add-duplicate'], modified: ['1-mod-foo', '1-mod-bar'] },
        { modified: ['2-mod-foo'], deleted: ['2-del-foo'] },
        { added: [] },
        { added: ['add-duplicate'] },
      ];
    });

    it('returns an empty array when no files exist in commit', function () {
      let commits = [
        { added: [] },
        { added: [] },
        { added: [] },
        { added: [] },
      ];

      let files = github.getFiles(commits, 'added');

      expect(files.added).to.be.empty;
    });

    it('returns an array of files for provided type', function () {
      let files = github.getFiles(this.commits, 'modified');

      expect(files).to.eql(['1-mod-foo', '1-mod-bar', '2-mod-foo']);
    });

    it('does not include duplicates', function () {
      let files = github.getFiles(this.commits, 'added');

      expect(files).to.eql(['1-add-foo', 'add-duplicate']);
    });
  });
});
