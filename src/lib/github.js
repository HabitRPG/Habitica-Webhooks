'use strict';

let _ = require('lodash');

function getFiles (commits, type) {
  let files = _(commits).pluck(type).flattenDeep().uniq().filter().value();

  return files;
}

module.exports = {
  getFiles: getFiles,
};
