'use strict';

let _ = require('lodash');

function getFiles (commits, type) {
  let files = _(commits).map(type).flattenDeep().uniq().filter().value();

  return files;
}

module.exports = {
  getFiles: getFiles,
};
