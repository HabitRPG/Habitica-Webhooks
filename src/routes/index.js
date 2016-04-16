'use strict';

let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
  res.send('(ಠ_ಠ)').status(200);
});

module.exports = router;
