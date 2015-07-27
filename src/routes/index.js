let express = require('express');
let router = express.Router();

router.get('/', (req, res, next) => {
  res.send('(ಠ_ಠ)');
});

router.post('/webhook', (req, res, next) => {
  let body = req.body;
  res.sendStatus(200);
});

module.exports = router;
