'use strict';

let express = require('express');
let logger = require('morgan');
let bodyParser = require('body-parser');
let xhub = require('express-x-hub');

let config = require('./lib/config');

let routes = require('./routes');

let app = express();

app.use(logger('dev'));
app.use(xhub({ algorithm: 'sha1', secret: config.get('GITHUB_SECRET') }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res.status(err.status || 500);
});

module.exports = app;
