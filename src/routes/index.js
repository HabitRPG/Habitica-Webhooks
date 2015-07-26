let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.post('/webhook', (req, res, next) => {
  console.log("hit webhook endpoint");
  let body = req.body;
  console.log(body);
  res.sendStatus(200);
});

module.exports = router;
