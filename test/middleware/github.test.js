'use strict';

let githubMiddleware = require('../../src/middleware/github');
let config = require('../../src/lib/config');

describe('Github middleware', () => {
  afterEach(() => {
    sandbox.restore();
  });

  describe('checkXHub', () => {
    let checkXHub = githubMiddleware.checkXHub;

    beforeEach(function () {
      this.spy = sandbox.spy();
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

  describe('checkGithubBranch', () => {
    let checkGithubBranch = githubMiddleware.checkGithubBranch;

    beforeEach(function () {
      this.spy = sandbox.spy();
      this.req = {
        body: {
          ref: 'refs/heads/develop',
        },
      };
      this.res = {
        sendStatus: sandbox.spy(),
      };
    });

    it('calls next if branch matches', function () {
      sandbox.stub(config, 'get').withArgs('GITHUB_BRANCH_TO_WATCH').returns('develop');

      checkGithubBranch(this.req, this.res, this.spy);

      expect(this.spy).to.be.calledOnce;
      expect(this.spy).to.be.calledWithExactly();
    });

    it('does not call next if branch does not match', function () {
      sandbox.stub(config, 'get').withArgs('GITHUB_BRANCH_TO_WATCH').returns('not-develop');

      checkGithubBranch(this.req, this.res, this.spy);

      expect(this.spy).to.not.be.called;
    });

    it('sends a 204 status if branch does not match', function () {
      sandbox.stub(config, 'get').withArgs('GITHUB_BRANCH_TO_WATCH').returns('not-develop');

      checkGithubBranch(this.req, this.res, this.spy);

      expect(this.res.sendStatus).to.be.calledOnce;
      expect(this.res.sendStatus).to.be.calledWith(204);
    });
  });
});
