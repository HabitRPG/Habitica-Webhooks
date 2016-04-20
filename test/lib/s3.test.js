'use strict';
/* eslint-disable no-console */

let rewire = require('rewire');
let s3 = rewire('../../src/lib/s3');

describe('s3', () => {
  let s3Stub;

  beforeEach(() => {
    s3Stub = sandbox.stub();

    s3.__set__('BUCKET_NAME', 'test.bucket');
    s3.__set__('s3', { putObject: s3Stub });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('uploadFile', () => {
    it('returns a promise', () => {
      let promise = s3.uploadFile('buffer', 'fileName');

      expect(promise).to.respondTo('then');
    });

    it('calls s3.putObject', () => {
      s3.uploadFile('buffer', 'fileName');

      expect(s3Stub).to.be.calledOnce;
      expect(s3Stub).to.be.calledWith({
        Body: 'buffer',
        Key: 'fileName',
        Bucket: 'test.bucket',
      });
    });

    it('passes on s3 error to catch', (done) => {
      s3Stub.yields('s3 error');

      s3.uploadFile('buffer', 'fileName').catch((error) => {
        expect(error).to.eql('s3 error');
        done();
      });
    });

    it('logs a succesful upload', (done) => {
      sandbox.stub(console, 'info');
      s3Stub.yields(null, 'success');

      s3.uploadFile('buffer', 'fileName').then(() => {
        expect(console.info).to.be.calledOnce;
        expect(console.info).to.be.calledWith('fileName uploaded to test.bucket succesfully.');
        done();
      });
    });

    it('resolves with filename', (done) => {
      sandbox.stub(console, 'info');
      s3Stub.yields(null, 'success');

      s3.uploadFile('buffer', 'path/to/file').then((res) => {
        expect(res).to.eql('path/to/file');

        done();
      });
    });
  });
});
