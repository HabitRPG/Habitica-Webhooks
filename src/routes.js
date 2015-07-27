let express = require('express');
let router = express.Router();

let webhook = require('./webhook');

router.get('/', (req, res, next) => {
  res.send('(ಠ_ಠ)').status(200);
});

router.post('/webhook', (req, res, next) => {
  let isXHub = req.isXHub;
  let isXHubValid = req.isXHubValid();

  if (isXHub && isXHubValid) {
    let body = req.body;
    console.log(body);

    res.sendStatus(200);
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;
