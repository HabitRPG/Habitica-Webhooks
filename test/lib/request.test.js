'use strict';

let request = require('../../src/lib/request');
let superagent = require('superagent');

describe('request', () => {
  beforeEach(function () {
    this.requestStub = sandbox.stub();
    sandbox.stub(superagent, 'get').returns({
      end: this.requestStub,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getFileFromUrl', () => {
    it('returns a promise', () => {
      let promise = request.getFileFromUrl('http://badurl.example.com', 'testFile.png');

      expect(promise).to.respondTo('then');
    });

    it('rejects with error from bad request', function (done) {
      this.requestStub.yields('bad url');

      request.getFileFromUrl('http://badurl.example.com', 'testFile.png').catch((err) => {
        expect(err).to.eql('bad url');
        done();
      });
    });

    it('resolvs with file', function (done) {
      this.requestStub.yields(null, { body: 'a binary' });

      request.getFileFromUrl('http:.//goodurl.example.com/foo.png', 'testFile.png').then((file) => {
        expect(file).to.eql('a binary');
        done();
      });
    });
  });
});
