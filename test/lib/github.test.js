'use strict';

let github = require('../../src/lib/github');

describe('github', () => {
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
});
