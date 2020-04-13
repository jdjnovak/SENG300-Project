// a general API for querying our database
// right now, only functionality for SELECT queries. Feel free to (please!) add to this :)

require('dotenv').config();
var express = require("express");
var mysql = require('mysql');
var router = express.Router();
var dateObject = require('node-datetime')

// might have to change this if sending files through here... not sure.
router.use(express.json({ limit: '1mb' }));  // (basic) to ensure no insane loading of the db

var pool = mysql.createPool({  // using a pool so can handle multiple queries over time
  connectionLimit: process.env.LIMIT,  // important
  host: process.env.HOST,
  database: process.env.DB,
  user: process.env.USER,
  password: process.env.PW,
  debug: false
});  // contact Cody for these details if stuck

// add your API stuff here if you like :)


// use this one for DELETE queries.

// it's not parameterized (unsafe), but should be fine for how we'll use it

router.post('/delete', (req, res) => {
  let getQuery = req.body.query;
  pool.query(getQuery, (err, response) => {
    console.log("Connected to database...\n");
    if (err) {
      console.error(err);
      return;
    }
    console.log("Entry removed from table");
    res.send("Entry removed from table");
  });
})

router.get("/delete", function(req, res, next) {
  res.send("API for DELETE queries is working properly");
});





// use this one for SELECT queries
// it's not parameterized (unsafe), but should be fine for how we'll use it

router.post('/select', (req, res) => {
  let getQuery = req.body.query;
  pool.query(getQuery, (err, response) => {
    console.log("Connected to database...\n");
    if (err) {
      console.error(err);
      return;
    }
    console.log("Result of query \"" + getQuery + "\":");
    console.log(JSON.parse(JSON.stringify(response)));
    res.send(response);
  });
})

router.get("/select", function(req, res, next) {
  res.send("API for SELECT queries is working properly");
});



// used for INSERT queries, specifically for SUBMISSIONS. 
// It's parameterized (safe), since it's using user-input form data,

router.post('/insert-submission', (req, res) => {  
  var date = dateObject.create();
  var dateFormatted = date.format('Y-m-d');
  console.log(dateFormatted);
  let sub = req.body;
  let insertQuery = "INSERT INTO SUBMISSION VALUES (?,?,?,?,?,?,?,?,?)";
  let params = [ "DEFAULT", sub.fileURL, sub.title, sub.description, dateFormatted, 
                 sub.author, sub.revParentID, sub.revDeadline, sub.status  ];
  let preparedQuery = mysql.format(insertQuery, params);

  console.log(preparedQuery);
  pool.query(preparedQuery, (err, response) => {
    console.log("Connected to database...\n");
    if(err) {
      console.error(err);
      return;
    }
    console.log("article submission added to SUBMISSION table!");
    console.log(response.insertId); 
    res.send("Submission received by the server");     
  });
});

router.get("/insert-submission", function(req, res, next){
  res.send("API for INSERT (submission) queries is working properly");
});






/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'API is up and running on port 9000!' });
});


module.exports = router;
