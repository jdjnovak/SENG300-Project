// a general API for querying our database
// right now, only functionality for SELECT queries. Feel free to (please!) add to this :)

require('dotenv').config();
var express = require("express");
var mysql = require('mysql');
var router = express.Router();
var dateObject = require('node-datetime');

// might have to change this if sending files through here... not sure.
router.use(express.json({ limit: '1mb' }));  // (basic) to ensure no insane loading of the db

var pool = mysql.createPool({  // using a pool so can handle multiple queries over time
  connectionLimit: process.env.LIMIT,  // important
  host: process.env.HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  debug: false
});  // contact Cody for these details if stuck






// add your API stuff here if you like :)








// use this one for DELETE queries.
// it's not parameterized (unsafe), but should be fine for how we'll use it

router.post('/delete', (req, res) => {
  let getQuery = req.body.query;
  pool.query(getQuery, (err, response) => {
    console.log("Connecting to database...\n");
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
  console.log("Query string received from client:\n" + getQuery);
  pool.query(getQuery, (err, response) => {
    console.log("Connecting to database...\n");
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











// used for UPDATE queries, specifically for SUBMISSIONS

router.post('/update-submission', (req, res) => {
  let query = req.body.query;
  console.log("Query string received from client:\n" + query);
  pool.query(query, (err, response) => {
    console.log("Connecting to database...\n");
    if (err) {
      console.error(err);
      return;
    }
    console.log("Result of query \"" + query + "\":");
    console.log(JSON.parse(JSON.stringify(response)));
    res.send(response);
  });
})






// used for journal queries, specifically for JOURNAL. 
// It's parameterized (safe), since it's using user-input form data,

router.post('/insert-journal', (req, res) => {
  var date = dateObject.create();
  var pubDate = date.format('Y-m-d');
  console.log(pubDate);
  let journal = req.body;
  let insertQuery = "INSERT INTO JOURNAL VALUES (?,?,?,?,?)";
  let params = ["DEFAULT", journal.fileURL, escapeString(journal.title), pubDate, journal.editorID];
  let preparedQuery = mysql.format(insertQuery, params);

  console.log(preparedQuery);
  pool.query(preparedQuery, (err, response) => {
    console.log("Connecting to database...\n");
    if (err) {
      console.error(err);
      return;
    }
    console.log("article submission added to JOURNAL table!");
    console.log(response.insertId);
    res.send("journal received by the server");
  });
});










// used for INSERT queries on the REQUESTS table. 

router.post('/insert-requests', (req, res) => {  
  const requestData = req.body;
  let insertQuery = "INSERT INTO REQUESTS VALUES (?,?)";
  let params = [ requestData.subID, requestData.reviewerID];
  let preparedQuery = mysql.format(insertQuery, params);
  console.log(preparedQuery);

  pool.query(preparedQuery, (err, response) => {  // send it
    console.log("Connecting to database...\n");
    if(err) {
      console.error(err);
      return;
    }
    console.log("request added to REQUESTS table! Server response code: " + response); //used to be response.insertId
  });

  res.send("request added to system!"); 
});








// used for INSERT queries on the TOPICS table. 

router.post('/insert-topics', (req, res) => {  
  const topicData = req.body;
  let topic = topicData.topics.split(",");
  const numTopics = topic.length;
  let insertQuery = "INSERT INTO TOPICS VALUES (?,?)";

  for (let i = 0; i < numTopics; i++) {
      let params = [ topicData.subID, escapeString(topic[i]) ];
      let preparedQuery = mysql.format(insertQuery, params);
      console.log(preparedQuery);
  
      pool.query(preparedQuery, (err, response) => {  // send it
        console.log("Connecting to database...\n");
        if(err) {
          console.error(err);
          return;
        }
        console.log("topic tag added to TOPICS table! Server response code: " + response.insertId);
      });
    }//for

  res.send("topic(s) added to system"); 
});






// used for INSERT queries on the NOMINATED table. 
// don't really need to use a parameterized query here, but whatever

router.post('/insert-nominated-reviewers', (req, res) => {  
  let noms = req.body;
  let insertQuery = "INSERT INTO NOMINATED VALUES (?,?)";

  for (let i = 0; i < 4; i++) {
    if (noms.reviewer[i] !== null) {
      let params = [ noms.subID, noms.reviewer[i] ];
      let preparedQuery = mysql.format(insertQuery, params);
      console.log(preparedQuery);
  
      pool.query(preparedQuery, (err, response) => {  // send it
        console.log("Connecting to database...\n");
        if(err) {
          console.error(err);
          return;
        }
        console.log("nominated reviewer added to NOMINATED table!");
        console.log(response.insertId);     
      });
    } //if
  }//for

  res.send("nomination(s) added to system"); 
});

router.get("/insert-nominated-reviewers", function(req, res, next){
  res.send("API for INSERT (NOMINATED) queries is working properly");
});






// used for INSERT queries, specifically for SUBMISSIONS. 
// It's parameterized (safe), since it's using user-input form data,

router.post('/insert-submission', (req, res) => {
  var date = dateObject.create();
  var dateFormatted = date.format('Y-m-d');
  console.log(dateFormatted);
  let sub = req.body;
  let insertQuery = "INSERT INTO SUBMISSION VALUES (?,?,?,?,?,?,?,?,?)";
  let params = ["DEFAULT", sub.fileURL, escapeString(sub.title), escapeString(sub.description), dateFormatted,
    sub.author, sub.revParentID, sub.revDeadline, escapeString(sub.status)];
  let preparedQuery = mysql.format(insertQuery, params);

  console.log(preparedQuery);
  pool.query(preparedQuery, (err, response) => {
    console.log("Connecting to database...\n");
    if (err) {
      console.error(err);
      return;
    }
    console.log("article submission added to SUBMISSION table!");
    console.log(response.insertId);
    res.send("Submission received by the server");
  });
});

router.get("/insert-submission", function(req, res, next) {
  res.send("API for INSERT (submission) queries is working properly");
});






/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'API is up and running on port 9000!' });
});


function escapeString (st) {
  let escapedSt = "";
  const length = st.length;
  for (let i = 0 ; i < length; i++) {
    if (st[i] === "'")
      escapedSt += '\'';
    else if (st[i] === '"')
      escapedSt += "\"";
    else 
      escapedSt += st[i];
  }
  return escapedSt;
}


module.exports = router;
