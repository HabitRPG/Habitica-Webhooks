'use strict';

let rewire = require('rewire');
let s3 = rewire('../src/lib/s3');

describe('s3', () => {
  let s3Stub, requestStub, requestEndStub;

  beforeEach(() => {
    s3Stub = sandbox.stub();
    requestStub = sandbox.stub();
    requestEndStub = sandbox.stub();
    requestStub.returns({
      end: requestEndStub
    });

    s3.__set__('BUCKET_NAME', 'test.bucket');
    s3.__set__('s3', { putObject: s3Stub });
    s3.__set__('request', { get: requestStub });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('uploadFile', () => {

    it('calls s3.putObject', () => {
      s3.uploadFile('buffer', 'fileName');

      expect(s3Stub).to.be.calledOnce;
      expect(s3Stub).to.be.calledWith({
        Body: 'buffer',
        Key: 'fileName',
        Bucket: 'test.bucket'
      });
    });

    it('logs any errors', () => {
      sandbox.stub(console, 'error');
      s3Stub.yields('s3 error');

      s3.uploadFile('buffer', 'fileName');

      expect(console.error).to.be.calledOnce;
      expect(console.error).to.be.calledWith('ERROR: s3 error');
    });

    it('logs a succesful upload', () => {
      sandbox.stub(console, 'info');
      s3Stub.yields(null, 'success');

      s3.uploadFile('buffer', 'fileName');

      expect(console.info).to.be.calledOnce;
      expect(console.info).to.be.calledWith('fileName uploaded to test.bucket succesfully.');
    });
  });

  describe('getFileFromUrlAndUpload', () => {

    it('logs error when url is invalid', (done) => {
      sandbox.stub(console, 'error');
      requestEndStub.yields('bad url');

      s3.getFileFromUrlAndUpload('http://badurl.example.com', 'testFile.png', () => {
        expect(console.error).to.be.calledOnce;
        expect(console.error).to.be.calledWith('bad url');
        done();
      });
    });

    it('calls uploadFile when url is valid', (done) => {
      requestEndStub.yields(null, { body: 'a binary' });

      s3.getFileFromUrlAndUpload('http:.//goodurl.example.com/foo.png', 'testFile.png', () => {
        expect(s3Stub).to.be.calledOnce;
        done();
      });
    });
  });
});
