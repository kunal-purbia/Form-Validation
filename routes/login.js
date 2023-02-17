var express = require('express');
var router = express.Router();

const app = express();
app.use(express.json());
urlencoded = express.urlencoded({ extended: false });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

module.exports = router;
