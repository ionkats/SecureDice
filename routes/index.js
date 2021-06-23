var express = require('express');
const dice = require("../controllers/dice")
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.post('/api/initiate', dice.initiate);
router.post('/api/finalize', dice.finalize);

module.exports = router;
