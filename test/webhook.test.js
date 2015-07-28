let rewire = require('rewire');
let webhook = require('../src/webhook');

let config = require('../src/config');


describe('webhook', () => {

  describe('verifyBranch', () => {

    beforeEach(() => {
      config.set('GITHUB_BRANCH_TO_WATCH', 'foo');
    });

    it('returns false if not the correct branch', () => {
      let ref = 'refs/heads/bar';
      let result = webhook.verifyBranch(ref);

      expect(result).to.eql(false);
    });

    it('returns true if the branch to check matches the ref', () => {
      let ref = 'refs/heads/foo';
      let result = webhook.verifyBranch(ref);

      expect(result).to.eql(true);
    });
  });

  describe('getWatchedFiles', () => {

    beforeEach(() => {
      let directoriesToWatch = [ 'foo', 'bar/baz' ];
      config.set('GITHUB_WATCHED_DIRECTORIES',directoriesToWatch);
    });

    context('no new files added in commits', () => {
      it('is empty', () => {
        let body = {
          commits: [
            { added: [] }
          ]
        };

        let images = webhook.getWatchedFiles(body);
        expect(images).to.be.empty;
      });
    });

    context('no files in directories that are being watched', () => {
      it('is empty', () => {
        let body = {
          commits: [
            { added: ['some/other/file'] }
          ]
        };

        let images = webhook.getWatchedFiles(body);
        expect(images).to.be.empty;
      });
    });

    context('files in directory that is being watched', () => {
      it('returns files', () => {
        let addedFiles = [
          'foo/image.png',
          'bar/baz/another_image.png'
        ];
        let body = {
          commits: [{ added: addedFiles }]
        };

        let images = webhook.getWatchedFiles(body);
        expect(images).to.exist;
        expect(images).to.eql(['foo/image.png', 'bar/baz/another_image.png']);
      });

      it('does not return unwatched files', () => {
        let addedFiles1 = [
          'foo/image.png',
          'zop/another_image.png'
        ];
        let addedFiles2 = [
          'foo/image2.png',
          'zop/another_image2.png'
        ];
        let body = {
          commits: [{ added: addedFiles1 }, { added: addedFiles2 }]
        };

        let images = webhook.getWatchedFiles(body);
        expect(images).to.exist;
        expect(images).to.eql(['foo/image.png', 'foo/image2.png']);
      });
    });
  });
});
