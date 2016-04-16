'use strict';

let config = require('../lib/config');

function checkXHub (req, res, next) {
  if (req.isXHub && req.isXHubValid()) {
    next();
  } else {
    let error = new Error('could not authorize XHub');
    error.status = 403;
    next(error);
  }
}

function checkGithubBranch (req, res, next) {
  let branchToCheck = config.get('GITHUB_BRANCH_TO_WATCH');
  let refToCheck = `refs/heads/${branchToCheck}`;
  let ref = req.body && req.body.ref;

  if (ref !== refToCheck) {
    return res.sendStatus(204);
  }

  next();
}

module.exports = {
  checkXHub: checkXHub,
  checkGithubBranch: checkGithubBranch,
};
