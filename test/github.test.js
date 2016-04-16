'use strict';

let github = require('../src/lib/github');
let config = require('../src/lib/config');

describe('github', () => {
  describe('getWatchedFiles', () => {
    beforeEach(() => {
      let directoriesToWatch = '["foo", "bar/baz"]';
      config.set('GITHUB_WATCHED_DIRECTORIES', directoriesToWatch);
    });

    context('no new files added in commits', () => {
      it('is empty', () => {
        let body = {
          commits: [
            { added: [] },
          ],
        };

        let images = github.getWatchedFiles(body);
        expect(images).to.be.empty;
      });
    });

    context('no files in directories that are being watched', () => {
      it('is empty', () => {
        let body = {
          commits: [
            { added: ['some/other/file'] },
          ],
        };

        let images = github.getWatchedFiles(body);
        expect(images).to.be.empty;
      });
    });

    context('files in directory that is being watched', () => {
      it('returns files', () => {
        let addedFiles = [
          'foo/image.png',
          'bar/baz/another_image.png',
        ];
        let body = {
          commits: [{ added: addedFiles }],
        };

        let images = github.getWatchedFiles(body);
        expect(images).to.exist;
        expect(images).to.eql(['foo/image.png', 'bar/baz/another_image.png']);
      });

      it('does not return unwatched files', () => {
        let addedFiles1 = [
          'foo/image.png',
          'zop/another_image.png',
        ];
        let addedFiles2 = [
          'foo/image2.png',
          'zop/another_image2.png',
        ];
        let body = {
          commits: [{ added: addedFiles1 }, { added: addedFiles2 }],
        };

        let images = github.getWatchedFiles(body);
        expect(images).to.exist;
        expect(images).to.eql(['foo/image.png', 'foo/image2.png']);
      });

      it('includes modified files', () => {
        let modifiedFiles = [
          'foo/image.png',
        ];
        let addedFiles = [
          'foo/image2.png',
        ];
        let body = {
          commits: [{
            added: addedFiles,
            modified: modifiedFiles,
          }],
        };

        let images = github.getWatchedFiles(body);
        expect(images).to.exist;
        expect(images).to.have.length(2);
        expect(images).to.include('foo/image.png');
        expect(images).to.include('foo/image2.png');
      });
    });
  });
});
