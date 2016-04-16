'use strict';

let checkXHub = require('../../src/middleware/xhub').checkXHub;

describe('XHub middleware', () => {
  beforeEach(function () {
    this.spy = sinon.spy();
    this.req = {
      isXHub: true,
      isXHubValid () {
        return true;
      },
    };
    this.expectedError = new Error('could not authorize XHub');
    this.expectedError.status = 403;
  });

  it('calls next without an error if req.isXhub exists and req.isXHubValid returns true', function () {
    checkXHub(this.req, null, this.spy);

    expect(this.spy).to.be.calledOnce;
    expect(this.spy).to.be.calledWithExactly();
  });

  it('returns an error if req.isXhub does not exist', function () {
    delete this.req.isXHub;

    checkXHub(this.req, null, this.spy);

    expect(this.spy).to.be.calledOnce;
    expect(this.spy).to.be.calledWith(this.expectedError);
  });

  it('returns an error if req.isXHubValid does not return true', function () {
    this.req.isXHubValid = () => false;

    checkXHub(this.req, null, this.spy);

    expect(this.spy).to.be.calledOnce;
    expect(this.spy).to.be.calledWith(this.expectedError);
  });
});
