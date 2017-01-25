'use strict';

let express = require('express');
let router = express.Router(); // eslint-disable-line new-cap

router.get('/', (req, res) => {
  res.send('(ಠ_ಠ)').status(200);
});

module.exports = router;
