'use strict';

let path = require('path');
let nconf = require('nconf');
nconf
  .env()
  .argv()
  .file({ file: path.join(__dirname, '/../../config.json') });

module.exports = nconf;
