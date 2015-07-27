let express = require('express');
let logger = require('morgan');
let bodyParser = require('body-parser');
let xhub = require('express-x-hub');

let config = require('./config');

let routes = require('./routes');

let app = express();

app.use(logger('dev'));
app.use(xhub({ algorithm: 'sha1', secret: config.get('GITHUB_SECRET') }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
