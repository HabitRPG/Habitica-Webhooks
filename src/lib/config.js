'use strict';

let nconf = require('nconf');
nconf
  .env()
  .argv()
  .file({ file: './../../config.json' });

module.exports = nconf;
