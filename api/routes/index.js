// a general API for querying our database
// right now, only functionality for SELECT queries. Feel free to (please!) add to this :)

require('dotenv').config();
var express = require("express");
var mysql = require('mysql');
var router = express.Router();

// might have to change this if sending files through here... not sure.
router.use(express.json({ limit: '1mb' }));  // (basic) to ensure no insane loading of the db

var pool = mysql.createPool({  // using a pool so can handle multiple queries over time
  connectionLimit : process.env.LIMIT,  // important
  host: process.env.HOST,
  database: process.env.DB,
  user: process.env.USER,
  password: process.env.PW,
  debug:  false
});  // contact Cody for these details if stuck





// add your API stuff here if you like :)





router.post('/select', (req, res) => {  // use this one for your select queries
  let getQuery = req.body.query;
  pool.query(getQuery, (err, results) => {
    console.log("Connected to database...\n");
    if(err) {
      console.error(err);
      return;
    }
    console.log("Result of query \"" + getQuery + "\":");
    console.log(JSON.parse(JSON.stringify(results)));
    res.send(JSON.stringify(results));     
  });
})

router.get("/select", function(req, res, next){
  res.send("API for SELECT queries is working properly");
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'API is up and running on port 9000!' });
});



module.exports = router;