const express = require('express');
const {getHtml} = require("../util/renderer");
const router = express.Router();
const enums = require("../util/enums");

/* GET index page. */
router.get('/', function(req, res, next) {
  res.send(getHtml('en', enums.SCREEN, 'index'));
  next();
});

module.exports = router;
