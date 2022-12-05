const router = require('express').Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: process.env.APP_TITLE || 'Express' });
});

module.exports = router;
