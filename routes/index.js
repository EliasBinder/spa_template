const express = require('express');
const {getScreenHtml} = require("../util/renderer");
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send(getScreenHtml('en', 'index'));
});

module.exports = router;
