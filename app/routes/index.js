var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/webhook', function(req, res, next) {
  console.log("hit webhook endpoint");
  var body = req.body;
  console.log(body);
  res.sendStatus(200);
});

module.exports = router;
