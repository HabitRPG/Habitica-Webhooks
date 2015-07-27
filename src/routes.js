let express = require('express');
let router = express.Router();

router.get('/', (req, res, next) => {
  res.send('(ಠ_ಠ)').status(200);
});

router.post('/webhook', (req, res, next) => {
  let isValid = req.isXHubValid();

  if (isValid) {
    let body = req.body;
    console.log("VALID");
    res.sendStatus(200);
  } else {
    console.log("Not valid");
    res.sendStatus(403);
  }
});

module.exports = router;
