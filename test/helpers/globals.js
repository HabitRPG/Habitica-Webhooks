'use strict';

let chai = require('chai');
let sinonChai = require('sinon-chai');

chai.use(sinonChai);

global.sinon = require('sinon');
global.expect = require('chai').expect;
global.sandbox = global.sinon.sandbox.create();

// set up required env variables
/* eslint-disable no-process-env */
process.env.S3_SPRITES_DIRECTORY = 'path/to/s3/';
/* eslint-enable no-process-env */
