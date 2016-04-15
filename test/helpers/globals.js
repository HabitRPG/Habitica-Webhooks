'use strict';

let chai = require('chai');
let sinonChai = require('sinon-chai');

chai.use(sinonChai);

global.sinon = require('sinon');
global.expect = require('chai').expect;
global.sandbox = global.sinon.sandbox.create();
