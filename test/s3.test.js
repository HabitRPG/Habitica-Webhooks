let rewire = require('rewire');
let s3 = rewire('../src/s3');

describe('s3', () => {
  let s3Stub = sandbox.stub();

  beforeEach(() => {
    s3.__set__('BUCKET_NAME', 'test.bucket');
    s3.__set__('s3', { putObject: s3Stub });
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
});
