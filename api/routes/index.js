var express = require('express');
var router = express.Router();





/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Cody: I put the Admin API into "adminAPI.js"
// You can add your API code in this file
// ... or create a separate file for like I did
// ...(and then add its details to ../app.js)

module.exports = router;