'use strict';

function checkXHub (req, res, next) {
  if (req.isXHub && req.isXHubValid()) {
    next();
  } else {
    let error = new Error('could not authorize XHub');
    error.status = 403;
    next(error);
  }
}

module.exports = {
  checkXHub: checkXHub,
};
