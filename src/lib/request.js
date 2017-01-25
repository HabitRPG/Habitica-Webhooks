'use strict';

let request = require('superagent');
global.Promise = require('bluebird');

function getFileFromUrl (url) {
  return new Promise((resolve, reject) => {
    request.get(url).end((err, res) => {
      if (err) return reject(err);

      let file = res.body;

      resolve(file);
    });
  });
}

module.exports = {
  getFileFromUrl,
};

